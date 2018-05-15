import { publish } from "gh-pages";

publish('build', function(err) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Publish success!', new Date());
    }
});