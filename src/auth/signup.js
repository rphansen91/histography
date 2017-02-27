const { wrapper } = require('../routes');

const signUpWrapper = ({ token, messages }) => wrapper({
    styles: `
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <style>form {margin-top: 20px;}</style>
    `,
    meta: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`
})(`
    <div class="container">
        <div class="col-md-4 col-md-offset-4">
            <h1>Sign Up</h1>
            ${ messages?messages.map(m => `
                <div class="alert alert-danger">${m}</div>    
            `).join(''):'' }
            <form action="/user/signup" method="post">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="text" name="email" class="form-control" placeholder="Email" aria-describedby="sizing-addon1">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" type="password" name="password" class="form-control" placeholder="Password" aria-describedby="sizing-addon1">
                </div>
                <input type="hidden" name="csrf" value="${token}" />
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
`)

module.exports = signUpWrapper;