const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

function startCronJobs() {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily midnight cron job (IST)...');
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istNow = new Date(utc + (3600000 * 5.5));
    istNow.setDate(istNow.getDate() - 1);
    const yesterdayStr = istNow.toISOString().split('T')[0];
    
    try {
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) throw error;
      
      const dayOfWeek = new Date(utc + (3600000 * 5.5)).getDay(); 
      const isMonday = dayOfWeek === 1;

      for (const user of users) {
        let newStreak = user.currentStreak || 0;
        let longest = user.longestStreak || 0;
        
        const studiedYesterday = user.lastStudyDate === yesterdayStr;
        
        if (studiedYesterday) {
          newStreak += 1;
          if (newStreak > longest) longest = newStreak;
        } else {
          newStreak = 0;
        }
        
        const updates = {
          todayMinutes: 0,
          currentStreak: newStreak,
          longestStreak: longest
        };
        
        if (isMonday) {
          updates.weeklyMinutes = 0;
        }
        
        await supabase.from('users').update(updates).eq('id', user.id);
      }
      console.log('Daily reset and streak calculation complete.');
      
    } catch (err) {
      console.error('Cron job error:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
}

module.exports = { startCronJobs };
