export declare const withdrawElvn = "import Pack from 0xPack\nimport Elvn from 0xElvn\n\ntransaction(amount: UFix64?) {\n    let admin: &Pack.Administrator\n\n\tlet vaultRef: &Elvn.Vault\n\n    prepare(account: AuthAccount) {\n        self.admin = account\n            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)\n            ?? panic(\"Signer is not the pack admin\")\n\t\t\n\t\tself.vaultRef = account\n\t\t\t.borrow<&Elvn.Vault>(from: /storage/elvnVault)\n\t\t\t?? panic(\"Not found elvnVault\")\n    }\n\n    execute {\n\t\tlet vault <- self.admin.withdraw(amount: amount)\n\t\tself.vaultRef.deposit(from: <- vault)\n    }\n}\n";
