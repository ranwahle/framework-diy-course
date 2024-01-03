export default /*html*/ `
<style>
    a:target {
        display: none;
    }
</style>
<div>
  <h1>Registration Form</h1>
    <label>
    Username: <input type="text" name="username">
    </label>
    <label>
    Password: <input type="password" name="password">
    </label>
    <router-outlet path="/register/new">
        <template>
    <label>

    Confirm Password: <input type="password" name="confirm-password">
    </label>
    <a href="#/register">Existing User?</a>
    </template>
    </router-outlet>
    <a id="/register/new" href="#/register/new">Register</a>
    </div>`