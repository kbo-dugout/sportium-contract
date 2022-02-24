export declare const getElvnFusdFlowBalance = "import Elvn from 0xElvn\nimport FUSD from 0xFUSD\nimport FlowToken from 0xFlowToken\nimport FungibleToken from 0xFungibleToken\n\npub fun main(address: Address): {String: UFix64} {\n    let account = getAccount(address)\n    \n    let elvnRef = account.getCapability(/public/elvnBalance)!.borrow<&Elvn.Vault{FungibleToken.Balance}>()\n        ?? panic(\"Could not borrow Balance reference to the Vault\")\n\n    let fusdRef = account.getCapability(/public/fusdBalance)!\n        .borrow<&FUSD.Vault{FungibleToken.Balance}>()\n        ?? panic(\"Could not borrow Balance reference to the Vault\")\n    \n    let flowRef = account.getCapability(/public/flowTokenBalance)!\n        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()\n        ?? panic(\"Could not borrow Balance reference to the Vault\")\n\n    return {\n        \"elvn\": elvnRef.balance,\n        \"fusd\": fusdRef.balance,\n        \"flow\": flowRef.balance\n    }\n}\n";
