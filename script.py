from amazonproduct import API
from lxml import etree

api = API(locale='us')


# get all books from result set and
# # print author and title
for result in api.item_search('chair', SearchIndex='HomeGarden', Keywords='wood',
                              ResponseGroup='ItemAttributes'):

    width, height, length, weight = (-1,-1,-1,-1)
    if hasattr(result.ItemAttributes, 'ItemDimensions'):
        if hasattr(result.ItemAttributes.ItemDimensions, 'Width'):
            width = result.ItemAttributes.ItemDimensions.Width;
        if hasattr(result.ItemAttributes.ItemDimensions, 'Height'):
            height = result.ItemAttributes.ItemDimensions.Height;
        if hasattr(result.ItemAttributes.ItemDimensions, 'Length'):
            length = result.ItemAttributes.ItemDimensions.Length;
        if hasattr(result.ItemAttributes.ItemDimensions, 'Weight'):
            weight = result.ItemAttributes.ItemDimensions.Weight;

    print "(W, H, L) - weight  => (%d, %d, %d) - %d", width, height, length, weight
