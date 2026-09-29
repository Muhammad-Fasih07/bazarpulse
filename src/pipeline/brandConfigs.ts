export interface BrandScraperConfig {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  websiteUrl: string;
  categoryTag?: string; // Eastern, Western, Kids, Footwear, Luxury
  platform: 'SHOPIFY' | 'CUSTOM_REST' | 'CATALOG_FEED' | 'MAGENTO_HTML' | 'HTML_CHEERIO';
  productsEndpoint?: string;
  saleEndpoint?: string;
  collectionEndpoints?: string[];
  isFeatured?: boolean;
  defaultGender?: 'WOMEN' | 'MEN' | 'KIDS' | 'UNISEX';
  selectors?: {
    productCard: string;
    title: string;
    productUrl: string;
    image: string;
    salePrice: string;
    originalPrice: string;
  };
}

export const PAKISTANI_BRANDS_CONFIG: BrandScraperConfig[] = [
  // 1. Sapphire
  {
    id: 'sapphire',
    name: 'Sapphire',
    slug: 'sapphire',
    categoryTag: 'Eastern & Pret',
    logoUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://pk.sapphireonline.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://pk.sapphireonline.com.pk/products.json',
    saleEndpoint: 'https://pk.sapphireonline.com.pk/collections/special-offers/products.json',
    collectionEndpoints: [
      'https://pk.sapphireonline.com.pk/collections/woman-unstitched/products.json',
      'https://pk.sapphireonline.com.pk/collections/ready-to-wear/products.json',
      'https://pk.sapphireonline.com.pk/collections/man/products.json',
      'https://pk.sapphireonline.com.pk/collections/kids/products.json'
    ],
    isFeatured: true,
  },

  // 2. Outfitters
  {
    id: 'outfitters',
    name: 'Outfitters',
    slug: 'outfitters',
    categoryTag: 'Western & Streetwear',
    logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://outfitters.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://outfitters.com.pk/products.json',
    saleEndpoint: 'https://outfitters.com.pk/collections/sale/products.json',
    collectionEndpoints: [
      'https://outfitters.com.pk/collections/men-sale/products.json',
      'https://outfitters.com.pk/collections/women-sale/products.json',
      'https://outfitters.com.pk/collections/juniors-sale/products.json'
    ],
    isFeatured: true,
  },

  // 3. Khaadi
  {
    id: 'khaadi',
    name: 'Khaadi',
    slug: 'khaadi',
    categoryTag: 'Eastern & Pret',
    logoUrl: 'https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://pk.khaadi.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://pk.khaadi.com/products.json',
    saleEndpoint: 'https://pk.khaadi.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 4. J. Junaid Jamshed
  {
    id: 'junaid-jamshed',
    name: 'J. Junaid Jamshed',
    slug: 'j-dot',
    categoryTag: 'Eastern & Fragrances',
    logoUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.junaidjamshed.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.junaidjamshed.com/products.json',
    saleEndpoint: 'https://www.junaidjamshed.com/collections/promotions/products.json',
    isFeatured: true,
  },

  // 5. Gul Ahmed / Ideas
  {
    id: 'gul-ahmed',
    name: 'Gul Ahmed / Ideas',
    slug: 'gul-ahmed',
    categoryTag: 'Lawn & Home',
    logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.gulahmedshop.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.gulahmedshop.com/products.json',
    saleEndpoint: 'https://www.gulahmedshop.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 6. Nishat Linen
  {
    id: 'nishat-linen',
    name: 'Nishat Linen',
    slug: 'nishat-linen',
    categoryTag: 'Eastern & Luxury',
    logoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://nishatlinen.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://nishatlinen.com/products.json',
    saleEndpoint: 'https://nishatlinen.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 7. Sana Safinaz
  {
    id: 'sana-safinaz',
    name: 'Sana Safinaz',
    slug: 'sana-safinaz',
    categoryTag: 'Designer Luxury',
    logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.sanasafinaz.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.sanasafinaz.com/products.json',
    saleEndpoint: 'https://www.sanasafinaz.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 8. Bachaa Party
  {
    id: 'bachaa-party',
    name: 'Bachaa Party',
    slug: 'bachaa-party',
    categoryTag: 'Kids & Infants',
    logoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://bachaaparty.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://bachaaparty.com/products.json',
    saleEndpoint: 'https://bachaaparty.com/collections/clearance-sale/products.json',
    isFeatured: true,
    defaultGender: 'KIDS',
  },

  // 9. Ethnic
  {
    id: 'ethnic',
    name: 'Ethnic',
    slug: 'ethnic',
    categoryTag: 'Fusion & Pret',
    logoUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://ethnic.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://ethnic.pk/products.json',
    saleEndpoint: 'https://ethnic.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 10. Limelight
  {
    id: 'limelight',
    name: 'Limelight',
    slug: 'limelight',
    categoryTag: 'Affordable Pret',
    logoUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.limelight.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.limelight.pk/products.json',
    saleEndpoint: 'https://www.limelight.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 11. Alkaram Studio
  {
    id: 'alkaram',
    name: 'Alkaram Studio',
    slug: 'alkaram',
    categoryTag: 'Eastern & Pret',
    logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.alkaramstudio.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.alkaramstudio.com/products.json',
    saleEndpoint: 'https://www.alkaramstudio.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 12. Bonanza Satrangi
  {
    id: 'bonanza-satrangi',
    name: 'Bonanza Satrangi',
    slug: 'bonanza-satrangi',
    categoryTag: 'Eastern & Fragrances',
    logoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://bonanzasatrangi.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://bonanzasatrangi.com/products.json',
    saleEndpoint: 'https://bonanzasatrangi.com/collections/sale/products.json',
    isFeatured: true,
  },

  // 13. Generation
  {
    id: 'generation',
    name: 'Generation',
    slug: 'generation',
    categoryTag: 'Artisanal Pret',
    logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://generation.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://generation.com.pk/products.json',
    saleEndpoint: 'https://generation.com.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 14. Zellbury
  {
    id: 'zellbury',
    name: 'Zellbury',
    slug: 'zellbury',
    categoryTag: 'Value Pret & Lawn',
    logoUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://zellbury.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://zellbury.com/products.json',
    saleEndpoint: 'https://zellbury.com/collections/sale/products.json',
    isFeatured: false,
  },

  // 15. BeechTree
  {
    id: 'beechtree',
    name: 'BeechTree',
    slug: 'beechtree',
    categoryTag: 'Women Pret & Western',
    logoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://beechtree.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://beechtree.pk/products.json',
    saleEndpoint: 'https://beechtree.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 16. Cross Stitch
  {
    id: 'cross-stitch',
    name: 'Cross Stitch',
    slug: 'cross-stitch',
    categoryTag: 'Embroidered Lawn',
    logoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://crossstitch.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://crossstitch.pk/products.json',
    saleEndpoint: 'https://crossstitch.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 17. Edenrobe
  {
    id: 'edenrobe',
    name: 'Edenrobe',
    slug: 'edenrobe',
    categoryTag: 'Men & Kids Formal',
    logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://edenrobe.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://edenrobe.com/products.json',
    saleEndpoint: 'https://edenrobe.com/collections/sale/products.json',
    isFeatured: false,
  },

  // 18. Breakout
  {
    id: 'breakout',
    name: 'Breakout',
    slug: 'breakout',
    categoryTag: 'Western & Denim',
    logoUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://breakout.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://breakout.com.pk/products.json',
    saleEndpoint: 'https://breakout.com.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 19. Cougar
  {
    id: 'cougar',
    name: 'Cougar',
    slug: 'cougar',
    categoryTag: 'Casual Western',
    logoUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.cougar.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.cougar.com.pk/products.json',
    saleEndpoint: 'https://www.cougar.com.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 20. Minnie Minors
  {
    id: 'minnie-minors',
    name: 'Minnie Minors',
    slug: 'minnie-minors',
    categoryTag: 'Kids & Infants',
    logoUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://minnieminors.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://minnieminors.com/products.json',
    saleEndpoint: 'https://minnieminors.com/collections/sale/products.json',
    isFeatured: false,
    defaultGender: 'KIDS',
  },

  // 21. Hopscotch
  {
    id: 'hopscotch',
    name: 'Hopscotch',
    slug: 'hopscotch',
    categoryTag: 'Kids Apparel',
    logoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://welovehopscotch.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://welovehopscotch.com/products.json',
    saleEndpoint: 'https://welovehopscotch.com/collections/sale/products.json',
    isFeatured: false,
    defaultGender: 'KIDS',
  },

  // 22. Stylo Shoes
  {
    id: 'stylo',
    name: 'Stylo',
    slug: 'stylo',
    categoryTag: 'Footwear & Bags',
    logoUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://stylo.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://stylo.pk/products.json',
    saleEndpoint: 'https://stylo.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 23. Borjan
  {
    id: 'borjan',
    name: 'Borjan',
    slug: 'borjan',
    categoryTag: 'Footwear & Handbags',
    logoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://borjan.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://borjan.com.pk/products.json',
    saleEndpoint: 'https://borjan.com.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 24. Servis Shoes
  {
    id: 'servis',
    name: 'Servis',
    slug: 'servis',
    categoryTag: 'Family Footwear',
    logoUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://servis.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://servis.pk/products.json',
    saleEndpoint: 'https://servis.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 25. Bata Pakistan
  {
    id: 'bata',
    name: 'Bata Pakistan',
    slug: 'bata',
    categoryTag: 'Footwear',
    logoUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.bata.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.bata.com.pk/products.json',
    saleEndpoint: 'https://www.bata.com.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 26. Ndure
  {
    id: 'ndure',
    name: 'Ndure',
    slug: 'ndure',
    categoryTag: 'Footwear & Athleisure',
    logoUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.ndure.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.ndure.com/products.json',
    saleEndpoint: 'https://www.ndure.com/collections/sale/products.json',
    isFeatured: false,
  },

  // 27. Engine
  {
    id: 'engine',
    name: 'Engine',
    slug: 'engine',
    categoryTag: 'Western Streetwear',
    logoUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://engine.com.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://engine.com.pk/products.json',
    saleEndpoint: 'https://engine.com.pk/collections/sale/products.json',
    isFeatured: false,
  },

  // 28. Furor
  {
    id: 'furor',
    name: 'Furor Jeans',
    slug: 'furor',
    categoryTag: 'Men Western',
    logoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://furorjeans.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://furorjeans.com/products.json',
    saleEndpoint: 'https://furorjeans.com/collections/sale/products.json',
    isFeatured: false,
  },

  // 29. Baroque
  {
    id: 'baroque',
    name: 'Baroque',
    slug: 'baroque',
    categoryTag: 'Luxury Formals',
    logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://baroque.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://baroque.pk/products.json',
    saleEndpoint: 'https://baroque.pk/collections/special-prices/products.json',
    isFeatured: true,
  },

  // 30. Charizma
  {
    id: 'charizma',
    name: 'Charizma',
    slug: 'charizma',
    categoryTag: 'Embroidered Lawn',
    logoUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://houseofcharizma.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://houseofcharizma.com/products.json',
    saleEndpoint: 'https://houseofcharizma.com/collections/sale/products.json',
    isFeatured: false,
  },

  // 31. Maria.B
  {
    id: 'maria-b',
    name: 'Maria.B',
    slug: 'maria-b',
    categoryTag: 'Designer Luxury',
    logoUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://www.mariab.pk',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://www.mariab.pk/products.json',
    saleEndpoint: 'https://www.mariab.pk/collections/sale/products.json',
    isFeatured: true,
  },

  // 32. Asim Jofa
  {
    id: 'asim-jofa',
    name: 'Asim Jofa',
    slug: 'asim-jofa',
    categoryTag: 'Festive & Formal',
    logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=128&auto=format&fit=crop&q=80',
    websiteUrl: 'https://asimjofa.com',
    platform: 'SHOPIFY',
    productsEndpoint: 'https://asimjofa.com/products.json',
    saleEndpoint: 'https://asimjofa.com/collections/sale/products.json',
    isFeatured: true,
  }
];
