export declare const openPack = "import Pack from 0xPack\nimport Moments from 0xMoments\n\ntransaction(packId: UInt64) {\n\tlet packCollection: &Pack.Collection\n\tlet momentsCollection: &Moments.Collection\n\n    prepare(account: AuthAccount) {\n\t\tself.packCollection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) \n\t\t\t?? panic(\"Colud not borrow reference to the owner's Pack Collection\")\n\t\tself.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)\n\t\t\t?? panic(\"Colud not borrow reference to the owner's Moments Collection\")\n    }\n\n\texecute {\n\t\tlet pack <- self.packCollection.withdraw(withdrawID: packId) \n\n\t\tlet moments <- pack.openPacks()\n\t\tdestroy pack\n\n\t\twhile moments.length > 0 {\n\t\t\tlet moment <- moments.removeFirst()\n\t\t\tself.momentsCollection.deposit(token: <- moment)\n\t\t}\n\t\tdestroy moments\n\t}\n}\n";
