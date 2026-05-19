
import dns from 'dns/promises';

async function test() {
  console.log('--- System DNS Check ---');
  try {
    const srv = await dns.resolveSrv('_mongodb._tcp.dalail.le18m42.mongodb.net');
    console.log('SRV Records found:', JSON.stringify(srv, null, 2));
  } catch (e: any) {
    console.error('SRV Lookup Failed:', e.message);
  }

  try {
    const lookup = await dns.lookup('ac-alilssd-shard-00-00.le18m42.mongodb.net');
    console.log('Shard Lookup:', lookup);
  } catch (e: any) {
    console.error('Shard Lookup Failed:', e.message);
  }
}

test();
