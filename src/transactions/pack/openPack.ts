export const openPack = `import Pack from 0xPack
import Moments from 0xMoments

transaction(packId: UInt64) {
	let packCollection: &Pack.Collection
	let momentsCollection: &Moments.Collection

    prepare(account: AuthAccount) {
		self.packCollection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Pack Collection")
		self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
			?? panic("Colud not borrow reference to the owner's Moments Collection")
    }

	execute {
		let pack <- self.packCollection.withdraw(withdrawID: packId) 

		let moments <- pack.openPacks()
		destroy pack

		while moments.length > 0 {
			let moment <- moments.removeFirst()
			self.momentsCollection.deposit(token: <- moment)
		}
		destroy moments
	}
}
`;
