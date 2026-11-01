import {
  getNearestServicePoints,
  getTransitTime
} from '../src/integrations/shipping.adapter.ts'

async function main() {
  try {
    const servicePoints = await getNearestServicePoints('11152')
    console.log('Service Points-resultat:')
    console.log(JSON.stringify(servicePoints, null, 2))
  } catch (error) {
    console.error('Service Points-anropet misslyckades:', error)
  }

  try {
    const transitTime = await getTransitTime('11152', '75220')
    console.log('Transit Time-resultat:')
    console.log(JSON.stringify(transitTime, null, 2))
  } catch (error) {
    console.error('Transit Time-anropet misslyckades:', error)
  }
}

void main()
