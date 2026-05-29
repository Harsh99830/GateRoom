const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

// POST /api/study/session
router.post('/session', async (req, res) => {
  const { userId, minutesStudied } = req.body;
  if (!userId || !minutesStudied) return res.status(400).json({ error: 'Missing fields' });
  
  try {
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userErr || !user) return res.status(404).json({ error: 'User not found' });
    
    const todayMinutes = (user.todayMinutes || 0) + minutesStudied;
    const totalMinutes = (user.totalMinutes || 0) + minutesStudied;
    const weeklyMinutes = (user.weeklyMinutes || 0) + minutesStudied;
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5));
    const todayStr = ist.toISOString().split('T')[0];
    
    const { data: updated, error } = await supabase
      .from('users')
      .update({
        todayMinutes,
        totalMinutes,
        weeklyMinutes,
        lastStudyDate: todayStr
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/study/leaderboard?period=today|week|alltime&branch=all|CSE|ECE...
router.get('/leaderboard', async (req, res) => {
  const { period = 'today', branch = 'all' } = req.query;
  
  try {
    let orderCol = 'todayMinutes';
    if (period === 'week') orderCol = 'weeklyMinutes';
    if (period === 'alltime') orderCol = 'totalMinutes';
    
    let query = supabase.from('users').select('name, branch, todayMinutes, weeklyMinutes, totalMinutes, currentStreak').order(orderCol, { ascending: false }).limit(20);
    
    if (branch !== 'all' && branch !== 'Any') {
      query = query.eq('branch', branch);
    }
    
    let realUsers = [];
    try {
      const { data, error } = await query;
      if (!error && data) realUsers = data;
    } catch (e) {
      console.warn("Supabase query failed, returning bots only.", e.message);
    }
    
    const botEngine = require('../bots/botEngine');
    let bots = botEngine.bots;
    if (branch !== 'all' && branch !== 'Any') {
      bots = bots.filter(b => b.branch === branch);
    }
    
    const botList = bots.map(b => ({
      name: b.name,
      branch: b.branch,
      todayMinutes: b.todayMinutes,
      weeklyMinutes: b.todayMinutes * (new Date().getDay() || 7), 
      totalMinutes: b.todayMinutes * 30,
      currentStreak: b.streak,
      isBot: true
    }));
    
    const merged = [...(realUsers || []), ...botList]
      .sort((a, b) => (b[orderCol] || 0) - (a[orderCol] || 0))
      .slice(0, 3); // Return top 3 as requested
    
    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
