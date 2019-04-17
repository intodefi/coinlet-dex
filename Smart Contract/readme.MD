<strong>HOW TO DEPLOY A SMART CONTRACT?</strong>
<p>In this guide we deal with how anyone can deploy the smart contract on the Ethereum blockchain for DEX.</p>
<p>Install MetaMask</p>
<p>MetaMask is a browser extension that manages your Ethereum wallet and connects
your browser to the blockchain. This connection enables you to send transactions to the
Ethereum network. MetaMask is currently available for Chrome, Brave, Firefox, and
Opera.</p>
<p>After you install MetaMask, follow the setup instructions to create a wallet. Make sure to
safely store your mnemonic phrase and pick a secure password.</p>
<p>Deploy Contract</p>
<p>● Go to withpragma.com (note* this website is currently offline, please use a alternative).</p>
<p>● Login with valid credentials. Sign up if you don’t have an account.</p>
<p>● Paste the contract which you have.</p>
<p>● Goto the name of contract on the lines 151 and 168.</p>
<p>● Click on deploy button</p>
<p>● Now you’ll get a pop up with a select box. Choose your contract to deploy.</p>
<p>● Now you’ll be asked to fill the forms. Check below to know what the form asks.</p>
<p>○ The admin variable holds the account with special administrative
privileges. The admin account can change the admin account, change the
accountLevelsAddr, or lower the fees. The admin account cannot raise the
fees.</p>
<p>○ The feeAccount variable holds the account to which EtherDelta trading fees are paid.</p>
<p>○ The accountLevelsAddr variable holds the address of the contract that
specifies account levels. If the accountLevelsAddr is set to the zero
account, then no account levels will be in effect.</p>
<p>○ The feeMake, feeTake, and feeRebate variables hold the fee percentages,
times 1 ether. For example, since 1 ether = 10^18, 10^17 would
represents 10%.</p>
<p>○ The tokens variable is where user balances are stored. For example, if
your address is 0x123 and the DAO token address is 0xbb9, then your
DAO balance will be in tokens[0xbb9][0x123]. By special case, your Ether
balance will be in tokens[0][0x123]. Note that all Ether amounts are in Wei,
and all token amounts are in the base unit of the token (which is usually
Wei, but depends on the token).</p>
<p>○ The orders variable is used to keep track of orders that have been initiated
on-chain. For example, if your address is 0x123, and you create an order
with order hash 0x234, then orders[0x123][0x234] will be true.</p>
<p>○ The orderFills variable is used to keep track of orders that have been
partially or completely filled. For example, if you create a resting order
(using the account 0x123) to buy 10 tokens with a hash of 0x234, and
someone submits a transaction to sell you 5 tokens (taking out half of your
order), then orderFills[0x123][0x234] will be changed to 5.</p>
<p>● Click on next button.</p>
<p>● Now you’ll be redirected to MetaMask. Click on submit button.</p>
<p>● Now metamask will deploy your contract. Wait for the confirmation. It may take some time to deploy.</p>
