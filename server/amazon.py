from amazonproduct import API
from urlparse import urlparse

api = API(locale='us')

def AmazonPrice(url):
    # parse the api 
    parsed_url = urlparse(url)

    path_list = (parsed_url.path).split('/')
    item_id = "a"
    if len(path_list) >= 3:
        item_id = path_list[3]

    try:
        result = api.item_lookup(item_id,
                                 ResponseGroup='ItemAttributes,OfferListings,Images',
                                 MerchantID='Amazon')
    except:
        return {'error':"item error"}

    attributes = result.Items.Item.ItemAttributes

    attr = {}
    attr['width'] = -1;
    attr['height'] = -1;
    attr['length'] = -1;
    attr['weight'] = -1;
    attr['price'] = -1;
    attr['type'] = "";
    attr['image'] = "";

    attr['title'] = str(attributes.Title)

    if hasattr(attributes, 'ItemDimensions'):
        if hasattr(attributes.ItemDimensions, 'Width'):
            attr['width'] = attributes.ItemDimensions.Width / 100.0
        if hasattr(attributes.ItemDimensions, 'Height'):
            attr['height'] = attributes.ItemDimensions.Height / 100.0
        if hasattr(attributes.ItemDimensions, 'Length'):
            attr['length'] = attributes.ItemDimensions.Length / 100.0
        if hasattr(attributes.ItemDimensions, 'Weight'):
            attr['weight'] = attributes.ItemDimensions.Weight / 100.0
            print attributes.ItemDimensions.Weight;

    if hasattr(result.Items.Item, 'Offers'):
        if hasattr(result.Items.Item.Offers, 'Offer'):
            if hasattr(result.Items.Item.Offers.Offer, 'OfferListing'):
                if hasattr(result.Items.Item.Offers.Offer.OfferListing, 'SalePrice'):
                    attr['price'] = str(result.Items.Item.Offers.Offer.
                                        OfferListing.SalePrice.FormattedPrice)
                else:
                    attr['price'] = str(result.Items.Item.Offers.Offer.
                                        OfferListing.Price.FormattedPrice)

    if hasattr(attributes, 'ProductGroup'):
        attr['type'] = str(attributes.ProductGroup)

    if hasattr(result.Items.Item.ImageSets, 'ImageSet'):
        if hasattr(result.Items.Item.ImageSets.ImageSet, 'MediumImage'):
            attr['image'] = result.Items.Item.ImageSets.ImageSet.MediumImage.URL
        elif hasattr(result.Items.Item.ImageSets.ImageSet, 'SmallImage'):
            attr['image'] = result.Items.Item.ImageSets.ImageSet.SmallImage.URL
        elif hasattr(result.Items.Item.ImageSets.ImageSet, 'LargeImage'):
            attr['image'] = result.Items.Item.ImageSets.ImageSet.LargeImage.URL


    # check if some of the dimensions (W,H,L) and weight weren't found
    # use package dimensions / weight instead

    if attr['width'] == -1:
        attr['width'] = attributes.PackageDimensions.Width / 100.0;
    if attr['height'] == -1:
        attr['height'] = attributes.PackageDimensions.Height / 100.0;
    if attr['length'] == -1:
        attr['length'] = attributes.PackageDimensions.Length / 100.0;
    if attr['weight'] == -1:
        attr['weight'] = attributes.PackageDimensions.Weight / 100.0;

    attr['image'] = str(attr['image'])

    return attr

if __name__ == "__main__":
    print "test: ", AmazonPrice("http://www.amazon.com/gp/product/B00NJNEE3O/ref=s9_al_gw_g147_i2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=desktop-3&pf_rd_r=0FXQ0PKA5VD6CF4R7T8M&pf_rd_t=36701&pf_rd_p=1990170002&pf_rd_i=desktop")

