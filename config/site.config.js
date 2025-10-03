// Site Configuration
const siteConfig = {
    // Basic site information
    siteName: 'PrAIvacy',
    siteDescription: 'Redefining AI for the Real World - World\'s first blockchain inspired Trust Tech Architecture',
    siteUrl: 'https://your-domain.com',
    
    // Company information
    company: {
        name: 'Proppy Sdn. Bhd.',
        email: 'info@praivacy.com',
        phone: '+60-xxx-xxx-xxxx',
        address: 'Your Company Address',
        founded: '2022'
    },
    
    // SEO settings
    seo: {
        keywords: 'AI security, privacy technology, digital solutions, business automation',
        author: 'PrAIvacy Team',
        robots: 'index, follow',
        ogImage: '/src/assets/images/banner.jpeg'
    },
    
    // Social media links
    social: {
        linkedin: 'https://linkedin.com/company/praivacy',
        twitter: 'https://twitter.com/praivacy',
        facebook: 'https://facebook.com/praivacy'
    },
    
    // Products configuration
    products: [
        {
            id: 'market360',
            name: 'Market360',
            tagline: 'Digitisation. Mobilisation. Connection',
            description: 'O2O Business Hub Platform',
            icon: '/src/assets/images/market360.svg',
            page: '/src/pages/market360.html'
        },
        {
            id: 'homes360',
            name: 'Homes360', 
            tagline: 'Smart Living Solutions',
            description: 'Intelligent Home Management',
            icon: '/src/assets/images/home360.svg',
            page: '/src/pages/homes360.html'
        },
        // Add other products...
    ],
    
    // Theme settings
    theme: {
        primaryColor: '#0a0a0a',
        secondaryColor: '#0d1117',
        accentColor: '#21262d',
        textColor: '#ffffff',
        font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}