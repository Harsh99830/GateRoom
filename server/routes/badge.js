const express = require('express');
const router = express.Router();
const { createCanvas } = require('canvas');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

// POST /api/badge/generate
router.post('/generate', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  
  try {
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userErr || !user) return res.status(404).json({ error: 'User not found' });
    
    const weeklyMinutes = user.weeklyMinutes || 0;
    const { count, error: countErr } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gt('weeklyMinutes', weeklyMinutes);
      
    let weeklyRank = (count || 0) + 1;
    
    // Account for bots
    const botEngine = require('../bots/botEngine');
    const bots = botEngine.bots;
    const botsHigher = bots.filter(b => (b.todayMinutes * 7) > weeklyMinutes).length;
    weeklyRank += botsHigher;
    
    const branch = user.branch;
    const streak = user.currentStreak || 0;
    const weeklyHours = (weeklyMinutes / 60).toFixed(1);
    
    // Generate PNG
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.arc(800, 200, 400, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 70px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`I studied ${weeklyHours} hrs this week`, 540, 400);
    
    ctx.font = '50px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#94a3b8'; 
    ctx.fillText(`Rank #${weeklyRank} | ${branch} | ${streak} day streak 🔥`, 540, 520);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 600);
    ctx.lineTo(740, 600);
    ctx.stroke();
    
    ctx.font = 'bold 45px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(user.name, 540, 700);
    
    ctx.font = 'bold 35px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('GATERoom.in', 540, 950);
    
    const base64Image = canvas.toDataURL('image/png');
    res.json({ success: true, image: base64Image });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate badge' });
  }
});

module.exports = router;
