import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
    // res.append('WWW-Authenticate', 'Basic realm="Access to the staging site."');
    res.append('WWW-Authenticate', 'Basic realm="myRealm"');
    // res.append('Authorization', ' Basic realm="myRealm"');

    console.log('Authorization value : ', res.getHeader('Authorization'));
    res.status(401).send('Unauthorized.');
});

export default router;
