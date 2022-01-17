import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import Moments from "../../contracts/Moments.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

pub fun getOrCreateStorefront(account: AuthAccount): &NFTStorefront.Storefront {
    if let storefrontRef = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) {
        return storefrontRef
    }

    let storefront <- NFTStorefront.createStorefront()

    let storefrontRef = &storefront as &NFTStorefront.Storefront

    account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

    account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)

    return storefrontRef
}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let elvnReceiver: Capability<&Elvn.Vault{FungibleToken.Receiver}>
    let momentsProvider: Capability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let momentsCollectionProviderPrivatePath = /private/momentsCollectionProvider

        self.elvnReceiver = account.getCapability<&Elvn.Vault{FungibleToken.Receiver}>(/public/elvnReceiver)!

        assert(self.elvnReceiver.borrow() != nil, message: "Missing or mis-typed Elvn receiver")

        if !account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath).check() {
            account.link<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath, target: Moments.CollectionStoragePath)
        }

        self.momentsProvider = account.getCapability<&Moments.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(momentsCollectionProviderPrivatePath)

        assert(self.momentsProvider.borrow() != nil, message: "Missing or mis-typed Moments.Collection provider")

        self.storefront = getOrCreateStorefront(account: account)
    }

    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.elvnReceiver,
            amount: saleItemPrice
        )
        self.storefront.createListing(
            nftProviderCapability: self.momentsProvider,
            nftType: Type<@Moments.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@Elvn.Vault>(),
            saleCuts: [saleCut]
        )
    }
}
 