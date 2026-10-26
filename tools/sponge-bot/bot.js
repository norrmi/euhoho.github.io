const mineflayer = require('mineflayer')

const SPONGE_NAMES = new Set(['sponge', 'wet_sponge'])

const bot = mineflayer.createBot({
  host: process.env.MC_HOST || 'no.sosal.today',
  port: Number(process.env.MC_PORT || 25565),
  username: process.env.MC_USERNAME || 'SpongeBot',
  auth: process.env.MC_AUTH || 'offline',
  version: process.env.MC_VERSION || '26.3'
})

async function dropSponges () {
  const sponges = bot.inventory.items().filter(item => SPONGE_NAMES.has(item.name))
  for (const item of sponges) {
    await bot.tossStack(item)
    console.log(`Dropped ${item.count} x ${item.name}`)
  }
  if (sponges.length === 0) console.log('No sponges in inventory')
}

bot.once('spawn', async () => {
  console.log(`Joined ${bot.game.serverBrand ?? 'server'} as ${bot.username}`)
  try {
    await dropSponges()
  } catch (err) {
    console.error('Failed to drop sponges:', err)
  } finally {
    bot.quit()
  }
})

bot.on('kicked', reason => console.error('Kicked:', reason))
bot.on('error', err => console.error('Error:', err))
bot.on('end', reason => console.log('Disconnected:', reason))
