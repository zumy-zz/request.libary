
const Require = require('./index.js'),
	fs = require('fs'),
	assert = require('assert'),
	crypto = require('crypto'),
	path = require('path');

const hash = (buf) => {
	const h = crypto.createHash('sha256');
	h.update(buf);
	return h.digest('hex');
};

const wrap = (p) => {
	return p.then(() => console.log('done')).catch((e) => {
		throw e;
	});
};

/* eslint no-sync: 0 */
const f = path.join(__dirname, 'test.data');
wrap(Require.download('https://raw.githubusercontent.com/anzerr/request.libary/master/.gitignore', f).then((res) => {
	assert.equal(hash(fs.readFileSync(f)), hash(fs.readFileSync('.gitignore')));
	assert.equal(f, res);
	fs.unlinkSync(f);
}));

wrap(new Require('https://api.github.com').headers({
	'user-agent': 'http://developer.github.com/v3/#user-agent-required'
}).get().then((res) => {
	assert.equal(res.isOkay(), true);
	assert.equal(typeof res.parse(), 'object');
	assert.equal(Buffer.isBuffer(res.body()), true);
	assert.equal(typeof res.body().toString(), 'string');
	assert.equal(res.headers()['content-type'], 'application/json; charset=utf-8');
	assert.deepEqual(JSON.parse(res.body().toString()), res.parse());
}));

wrap(new Require('google.com').options({redirect: false}).get().then((res) => {
	assert.equal(res.isStatus(3), true);
	assert.equal(res.status(), 301);
}));

wrap(new Require('google.com').get().then((res) => {
	assert.equal(res.isOkay(), true);
	assert.equal(res.isStatus(2), true);
}));
