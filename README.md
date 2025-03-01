NEXTJS not running the methods / functions all time !!!!

Normally jab hum koi bhi pure backend apps bnare hain
tb apps start hoti hor backend se connect hoti hai or fr chalti hi rhti hai (running state), islie hum cloud instances ko use krte hain or generally ase hi hona chhaiye

But But, next is different it is a edge time framework like jb jb user ki req ati hai tb tb chlti hai execute hoti h chize
for e.g. koi function bnaya to wo ontime run hojyega or fr use nahi h to nahi chlega, but pure backend mai ek bar connect hogyaa to chlte rehtii hai 


So it means db all time connected nahi h jse jse req jeygi tb tb connect hoyegaa, and fr agar db connection humne 2 second mai bar bar connect krdia, agr already connect hai fr bhi
to hume yeh checks lgane pdenge agr already connected hai to usi ko use krlo !!!


SSR (Server-Side Rendering) means that the page is generated on the server at the time of the request and then sent to the browser as a fully rendered HTML page.





--> packages needed!
// react-email
// resend
// next-auth


In NextAuth.js, the signIn function returns an object with the following properties:

{
  error: string | null;  // Contains an error message if login fails
  status: number;        // HTTP status code
  ok: boolean;           // `true` if successful, `false` otherwise
  url: string | null;    // Redirect URL (only if `redirect: true`)
}

// NOTE--> Optimistic UI --> hum suppose like krte hain insta pai, tb immediately like hojata hai or changes UI pai show hote hain, but wo changes Backend mai push nhi hote, wo bolte hain tum UI apii changes dekhlo hum bad mai backend pai update krlenge

Optimistic UI is a frontend technique where UI updates instantly before waiting for a server response. It assumes that the operation (like deleting a message) will succeed, providing a fast and smooth user experience.


router.replace("/") removes the login page from the history stack, but 
router.push("/") ensures smooth navigation.

