export declare const addItem = "import Pack from 0xPack\nimport Moments from 0xMoments\n\ntransaction(packId: UInt64, momentsIds: [UInt64]) {\n    let admin: &Pack.Administrator\n\n    let packCollectionRef: &Pack.Collection\n    let momentsCollectionRef: &Moments.Collection\n\n    prepare(account: AuthAccount) {\n        self.admin = account\n            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)\n            ?? panic(\"Signer is not the pack admin\")\n        \n        self.packCollectionRef = account\n            .borrow<&Pack.Collection>(from: Pack.CollectionStoragePath)\n            ?? panic(\"Unable to borrow receiver reference\")\n\n        self.momentsCollectionRef = account\n            .borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)\n            ?? panic(\"Unable to borrow moments collection ref\")\n    }\n\n    execute {\n        let momentsList: @[Moments.NFT] <- []\n        for id in momentsIds {\n            let moments <- self.momentsCollectionRef.withdraw(withdrawID: id) as! @Moments.NFT\n            momentsList.append(<- moments)\n        }\n\t\tlet pack <- self.packCollectionRef.withdraw(withdrawID: packId)\n\n\t\tself.admin.addItem(pack: <-pack, momentsList: <-momentsList)\n    }\n}\n";
