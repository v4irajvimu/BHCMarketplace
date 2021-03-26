import { toAddress, getOwner, getSingles, getMultiples, getCollectible } from './etherFunc';
import { hps721Address, hps1155Address, hpsAddress, bhcAddress } from "./addresses/constants"


////////get///////////////////
function tempUserData(addressString) {
    var address = toAddress(addressString);
    return {
        'cover_photo': "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg",
        'display_photo': "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        'name': "Empty User",
        'bio': "Empty Bio",
        'wallet': address,
        'short_url': "#",
    }
};

function tempCollectionData() {
    //var address = toAddress(addressString);
    return {
        'icon': "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        'name': "Empty Name",
        'Symbol': "Empty Symbol",
        'description': "Empty Description",
        'owner': "",
        'address': "",
        'owner': ""
    }
};

async function getUserDetails(addressString) {
    var address = toAddress(addressString);
    var user = tempUserData(address);
    try {
        var res = await axios.get("/api/profile/" + address);
        var response = await axios.get("https://ipfs.io/ipfs/" + res.data)
        //console.log(response)
        user.cover_photo = response.data.cover || user.cover_photo;
        user.display_photo = response.data.dp || user.display_photo;
        user.name = response.data.name;
        user.bio = response.data.description;
        user.short_url = response.data.short_url;
    }
    catch (e) { }
    return user;
};

async function getCollections(type, me) {

    var collections = [];

    ///delete///
    var t = tempCollectionData()
    t.address = hps721Address
    type == 721 ? collections.push(t) : null;
    var t = tempCollectionData()
    t.address = hps1155Address
    type == 1155 ? collections.push(t) : null;

    var res = await axios.get("/api/collections");
    var collectionsList = res.data;
    for (var i = 0; i < collectionsList.length; i++) {
        var selected = collectionsList[i];
        if (selected.type == type) {
            var owner;
            try {
                //owner = getOwner(selected.owner);
            }
            catch (e) { }
            if (owner == me) {
                //var t = tempCollectionData()
                //t["address"] = selected.address
                //collections.push(t)
            }
        }
    }
    return collections;
}

async function checkFollowing(user, address) {
    return false;
}


async function getTokens(owner) {
    var cl721 = await getCollections(721, "");
    var cl1155 = await getCollections(1155, "");
    var tokens721f = [];
    var tokens1155f = [];
    for (var i = 0; i < cl721.length; i++) {

        var contract = cl721[i].address
        var singles = await getSingles(contract, owner);
        tokens721f = [...tokens721f, ...singles];
    }
    for (var i = 0; i < cl1155.length; i++) {

        var contract = cl1155[i].address
        var multiples = await getMultiples(contract, owner);
        tokens1155f = [...tokens1155f, ...multiples];
    }

    return [tokens721f, tokens1155f];
}

async function getOwnedTokensData(owner, base_url) {
    var listed = false;
    var data = [];
    var tokens = await getTokens(owner);
    var tokens721 = tokens[0];
    var tokens1155 = tokens[1];
    for (var i = 0; i < tokens721.length; i++) {
        var selectedToken = tokens721[i];
        var res = await axios.get(selectedToken.URI);
        var nft = res.data;

        nft.copies = selectedToken.availableCopies;
        nft.ownedCopies = selectedToken.ownedCopies;
        nft.id = selectedToken.id;
        nft.contract = selectedToken.contract;
        nft.owner_id = selectedToken.tokenOwner;
        nft.collection = selectedToken.collection || tempCollectionData();
        nft.legend = nft.legend || "normal"

        ////remove/////
        nft.isp = 1
        nft.is_selling = await checkSelling(selectedToken.contract, selectedToken.tokenOwner, selectedToken.id)
        listed ? nft.price = nft.instant_sale_price : nft.price = nft.instant_sale_price
        data.push(nft);
    }
    for (var i = 0; i < tokens1155.length; i++) {
        var selectedToken = tokens1155[i];
        var res = await axios.get(selectedToken.URI);
        var nft = res.data

        nft.copies = selectedToken.availableCopies;
        nft.ownedCopies = selectedToken.ownedCopies;
        nft.id = selectedToken.id;
        nft.contract = selectedToken.contract;
        nft.owner_id = selectedToken.tokenOwner;
        nft.collection = selectedToken.collection || tempCollectionData();
        nft.legend = nft.legend || "normal"

        ////remove/////
        nft.isp = 1
        nft.is_selling = 1
        listed ? nft.price = nft.instant_sale_price : nft.price = nft.instant_sale_price;
        nft.fileType = "image";
        nft.file = nft.image
        data.push(nft);
    }
    return data;
}

async function getLikedTokens(owner, base_url) {
    var data = [];
    return data;
}

async function getCreatedTokens(owner, base_url) {
    var data = [];
    return data;
}

async function getOnSaleTokens(owner, base_url) {
    var data = [];
    var tokens721 = [];
    var tokens1155 = [];
    var res = await axios.get("/api/sales/" + owner);
    var tokens = res.data

    for (var i = 0; i < tokens.length; i++) {
        try {
            var nft = await getTokenData(
                tokens[i].collection,
                tokens[i].current_owner,
                tokens[i].token_id
            )
            nft.is_isp = 1;
            nft.is_selling = 1;
            nft.price = tokens[i].price;
            nft.currency = tokens[i].currency;
            data.push(nft)
        } catch (e) { }
    }

    return data;
}

async function getTokensData(owner, base_url) {
    var ownedTokens = await getOwnedTokensData(owner, base_url)
    var likedTokens = await getLikedTokens(owner, base_url);
    var createdTokens = await getCreatedTokens(owner, base_url);
    var onSaleTokens = await getOnSaleTokens(owner, base_url);

    var data = {
        "on-sale": onSaleTokens,
        "liked": likedTokens,
        "created": createdTokens,
        "collectibles": ownedTokens
    }
    //console.log(data)
    return data;
}

async function getTokenData(contract, owner, id) {
    var listed = false;
    var res = await axios.get("/api/collections/" + contract);
    var type = res.data.type
    var isPrivate = res.data.id > 2 ? true : false;
    var selectedToken = await getCollectible(contract, type, isPrivate, owner, id);
    var colData = await axios.get(selectedToken.URI);
    var nft = colData.data;
    /*data.current_owner = collectible.tokenOwner;
    data.is_selling = 1;
    data.collection = collectible.collection || tempCollectionData()
    data.ownedCopies = collectible.ownedCopies;
    data.type = type;

    listed ? data.price = data.instant_sale_price : data.price = data.instant_sale_price
    //////remove////
    data.fileType = data.fileType || "image";
    data.file = data.image || data.file
    data.creator = owner;
    data.count = collectible.availableCopies*/

    nft.copies = selectedToken.availableCopies;
    nft.ownedCopies = selectedToken.ownedCopies;
    nft.id = selectedToken.id;
    nft.contract = selectedToken.contract;
    nft.owner_id = selectedToken.tokenOwner;
    nft.collection = selectedToken.collection || tempCollectionData();
    nft.legend = nft.legend || "normal"

    ////remove/////
    nft.isp = 1
    nft.is_selling = await checkSelling(selectedToken.contract, selectedToken.tokenOwner, selectedToken.id)
    listed ? nft.price = nft.instant_sale_price : nft.price = nft.instant_sale_price
    nft.fileType = nft.fileType || "image";
    nft.file = nft.image || nft.file
    nft.creator = owner;
    nft.count = selectedToken.availableCopies

    return nft;

}

async function getAllSales(current_user) {
    var data = [];
    var tokens721 = [];
    var tokens1155 = [];
    var res = await axios.get("/api/sales");
    var tokens = res.data

    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].current_owner != current_user) {
            try {
                var nft = await getTokenData(
                    tokens[i].collection,
                    tokens[i].current_owner,
                    tokens[i].token_id
                )
                nft.price = 100//tokens[i].price;
                nft.isp = 1;
                nft.is_selling = 1;
                nft.currency = tokens[i].currency == hpsAddress ? "HPS" : tokens[i].currency == bhcAddress ? "BHC" : "BNB";
                data.push(nft)
            } catch (e) { }
        }
    }

    return data;
}

async function checkSelling(collection, owner, id) {
    var res = await axios.get(`/api/sales?collection=${collection}&current_owner=${owner}&token_id=${id}`
    )


    return res.data;
}


///////////////set///////////////
async function updateUserDetails(addressString, data) {
    var address = toAddress(addressString);
    await axios.patch(`/api/profile/${address}`, data);
}
async function addSale(data) {
    await axios.post(`/api/sales`, data);
}


export { getUserDetails, checkFollowing, tempUserData, getCollections, tempCollectionData, getTokens, getTokensData, getTokenData, addSale, updateUserDetails, getAllSales }