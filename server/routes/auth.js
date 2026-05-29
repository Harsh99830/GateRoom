const express = require('express');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const toCamelGateProfile = (profile) => {
  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.user_id,
    branch: profile.branch,
    targetYear: profile.target_year,
    attemptNumber: profile.attempt_number,
    collegeType: profile.college_type,
    monthsOfPrep: profile.months_of_prep,
    hoursPerDay: profile.hours_per_day,
    testSeries: profile.test_series,
    firstMockScore: profile.first_mock_score,
    mockScore: profile.first_mock_score,
    noMockYet: profile.no_mock_yet,
    syllabusCoverage: profile.syllabus_coverage,
    predictedRankLow: profile.predicted_rank_low,
    predictedRankHigh: profile.predicted_rank_high,
    air: profile.predicted_rank_low,
    onboardingDone: profile.onboarding_done,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const createUserSupabase = (accessToken) => createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
});

const getUserFromRequest = async (req) => {
  const accessToken = getBearerToken(req);
  if (!accessToken) {
    return { error: 'Missing authorization token' };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) {
    return { error: 'Invalid or expired authorization token' };
  }

  return { user: data.user, accessToken };
};

router.post('/google', async (req, res) => {
  try {
    const { code, idToken } = req.body;

    let googleIdToken = idToken;

    if (!googleIdToken && code) {
      const { tokens } = await googleClient.getToken(code);
      googleIdToken = tokens.id_token;
    }

    if (!googleIdToken) {
      return res.status(400).json({ message: 'Google authorization code is required' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: googleIdToken,
    });

    if (authError || !authData?.session || !authData?.user) {
      console.error('Supabase Google auth error:', authError);
      return res.status(401).json({ message: authError?.message || 'Google sign in failed' });
    }

    const { session, user } = authData;
    const userClient = createUserSupabase(session.access_token);
    const metadata = user.user_metadata || {};
    const profile = {
      user_id: user.id,
      name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'GATE Aspirant',
      email: user.email,
      avatar_url: metadata.avatar_url || metadata.picture || null,
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await userClient
      .from('profiles')
      .upsert(profile, { onConflict: 'user_id' });

    if (profileError) {
      console.error('Profile upsert error:', profileError);
      return res.status(500).json({
        message: 'Signed in, but profile storage failed. Check Supabase profiles table policies.',
      });
    }

    const { data: gateProfile, error: gateError } = await userClient
      .from('gate_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (gateError) {
      console.error('Gate profile fetch error:', gateError);
      return res.status(500).json({
        message: 'Signed in, but could not load GATE profile. Check Supabase gate_profiles policies.',
      });
    }

    return res.json({
      token: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
      user: {
        id: user.id,
        name: profile.name,
        email: user.email,
        avatarUrl: profile.avatar_url,
      },
      onboardingDone: !!gateProfile?.onboarding_done,
      gateProfile: toCamelGateProfile(gateProfile),
    });
  } catch (error) {
    console.error('Google auth route error:', error);
    return res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

router.post('/onboarding', async (req, res) => {
  try {
    const auth = await getUserFromRequest(req);
    if (auth.error) {
      return res.status(401).json({ message: auth.error });
    }

    const {
      branch,
      targetYear,
      attemptNumber,
      collegeType,
      monthsOfPrep,
      hoursPerDay,
      testSeries,
      firstMockScore,
      noMockYet,
      syllabusCoverage,
      predictedRankLow,
      predictedRankHigh,
    } = req.body;

    if (!branch || !targetYear || !collegeType || attemptNumber === undefined) {
      return res.status(400).json({ message: 'Please answer all required onboarding questions' });
    }

    const months = Number(monthsOfPrep);
    const hours = Number(hoursPerDay);
    const mockScore = noMockYet ? null : Number(firstMockScore);
    const syllabus = Number(syllabusCoverage);

    if (!Number.isFinite(months) || months < 0 || months > 36) {
      return res.status(400).json({ message: 'Months of preparation must be between 0 and 36' });
    }

    if (!Number.isFinite(hours) || hours < 0 || hours > 18) {
      return res.status(400).json({ message: 'Daily study hours must be between 0 and 18' });
    }

    if (!noMockYet && (!Number.isFinite(mockScore) || mockScore < 0 || mockScore > 100)) {
      return res.status(400).json({ message: 'Mock score must be between 0 and 100' });
    }

    if (!Number.isFinite(syllabus) || syllabus < 0 || syllabus > 100) {
      return res.status(400).json({ message: 'Syllabus coverage must be between 0 and 100' });
    }

    const userClient = createUserSupabase(auth.accessToken);
    const profileData = {
      user_id: auth.user.id,
      branch,
      target_year: String(targetYear),
      attempt_number: Number(attemptNumber) || 1,
      college_type: collegeType,
      months_of_prep: months,
      hours_per_day: hours,
      test_series: testSeries || null,
      first_mock_score: mockScore,
      no_mock_yet: !!noMockYet,
      syllabus_coverage: syllabus,
      predicted_rank_low: Number(predictedRankLow) || null,
      predicted_rank_high: Number(predictedRankHigh) || null,
      onboarding_done: true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await userClient
      .from('gate_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (error) {
      console.error('Onboarding save error:', error);
      return res.status(500).json({
        message: 'Failed to save onboarding data. Check Supabase gate_profiles table policies.',
      });
    }

    return res.json({ success: true, gateProfile: toCamelGateProfile(data) });
  } catch (error) {
    console.error('Onboarding route error:', error);
    return res.status(500).json({ message: 'Server error while saving onboarding' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const auth = await getUserFromRequest(req);
    if (auth.error) {
      return res.status(401).json({ message: auth.error });
    }

    const userClient = createUserSupabase(auth.accessToken);

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('*')
      .eq('user_id', auth.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ message: 'Failed to fetch profile' });
    }

    const { data: gateProfile, error: gateError } = await userClient
      .from('gate_profiles')
      .select('*')
      .eq('user_id', auth.user.id)
      .maybeSingle();

    if (gateError) {
      console.error('Gate profile fetch error:', gateError);
      return res.status(500).json({ message: 'Failed to fetch GATE profile' });
    }

    return res.json({
      profile,
      gateProfile: toCamelGateProfile(gateProfile),
      onboardingDone: !!gateProfile?.onboarding_done,
    });
  } catch (error) {
    console.error('Profile route error:', error);
    return res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

module.exports = router;
