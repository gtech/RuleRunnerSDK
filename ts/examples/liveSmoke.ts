import { RuleRunner } from '../dist';  // compiled output
// If you publish the package, use  import { RuleRunner } from '@rulerunner/sdk';

const apiKey = process.env.RULERUNNER_API_KEY;
if (!apiKey) {
    console.error('❌  Set RULERUNNER_API_KEY in your shell first'); process.exit(1);
}

(async () => {
    const rr = new RuleRunner({ apiKey });              // defaults to https://api.rulerunner.io
    console.log('▶  Hitting /health …');
    console.log(await rr.healthCheck());

    console.log('\n▶  Checking compliance …');
    const result = await rr.isCompliant({
        from_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',   // pick any two addresses
        to_address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
        amount: '1.23'
    });
    console.dir(result, { depth: null });
})();