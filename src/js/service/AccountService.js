export default class AccountService {
    constructor(fetchService) {
        this.fetchService = fetchService;
        this.baseUrl   = "https://hackathonxbookplatform.herokuapp.com";
        this.signUpPath = "/api/Account";
        this.loginPath = "/api/Account/login";
    }

    async signUp(form) {
        // Get form data in json format
        const jsonFormData = this.buildJsonFormData(form);
        // build headers
        const headers = this.buildHeaders();
        // request
        const response = await this.fetchService.performPostHttpRequest(`${this.baseUrl}${this.signUpPath}`, headers, jsonFormData);
        if(response.success)
            window.location = '/login.html';
        else
            alert("An error occured.");
    }

    async login(form) {
        // Get form data in json format
        const jsonFormData = this.buildJsonFormData(form);
        // build headers
        const headers = this.buildHeaders();
        const response = await this.fetchService.performPostHttpRequest(`${this.baseUrl}${this.loginPath}`, headers, jsonFormData);
        if(response.success) {
            this.storeUserInLocalStorage(response.result);
            window.location = "/index.html";
        }
        else
            alert(response.result.message);
    }

    logout() {
        localStorage.removeItem("user");
        window.location = '/index.html';
    }

    storeUserInLocalStorage(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    getUserFromLocalStorage() {
        const user = localStorage.getItem("user");
        return user;
    }

    buildHeaders(authorization = null) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": (authorization) ? authorization : "Bearer ",
        };
        return headers;
    }

    buildJsonFormData(form) {
        const jsonFormData = { };
        for(const pair of new FormData(form)) {
            jsonFormData[pair[0]] = pair[1];
        }
        return jsonFormData;
    }
}