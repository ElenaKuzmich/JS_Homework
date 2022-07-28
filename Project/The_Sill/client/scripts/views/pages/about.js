import Component from '../../views/component';

import Plants from '../../models/plants';
import Users from '../../models/users';

import AboutTemplate from '../../../templates/pages/about';

class About extends Component {
    constructor() {
        super();

        this.model = Users;
    }

    async getData() {
        this.plants = await Plants.getPlantsList();

        this.plants = this.plants.filter(plant => plant.userId === this.user.id);

        return this.plants;
    }

    async render(plants, instances, user) {
        return await AboutTemplate({plants, instances, user});
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const joinBtn = document.getElementsByClassName('about__btn-join')[0],
            loginBtn = document.getElementsByClassName('about__btn-login')[0],
            startBtn = document.getElementsByClassName('about__btn-start')[0],
            joinCancelBtn = document.getElementsByClassName('modal__btn-join-cancel')[0],
            loginCancelBtn = document.getElementsByClassName('modal__btn-login-cancel')[0],
            headerWrapper = document.getElementsByClassName('header__wrapper')[0],
            headerLogin = document.getElementsByClassName('header__login')[0],
            plantsAmount = document.getElementsByClassName('header__plants')[0],
            modal = document.getElementsByClassName('modal')[0], // Get the modal
            close = document.getElementsByClassName('modal__close')[0],
            joinTab = document.getElementsByClassName('modal__tab-join')[0],
            loginTab = document.getElementsByClassName('modal__tab-login')[0],
            modalTitle = document.getElementsByClassName('modal__title')[0],
            registrationForm = document.getElementsByClassName('modal__registration')[0],
            authenticationForm = document.getElementsByClassName('modal__authentication')[0],
            registrationUserNameField = registrationForm.getElementsByClassName('modal__username')[0],
            registrationEmailField = registrationForm.getElementsByClassName('modal__email')[0],
            registrationPasswordField = registrationForm.getElementsByClassName('modal__password')[0],
            authenticationUserNameField = authenticationForm.getElementsByClassName('modal__username')[0],
            authenticationPasswordField = authenticationForm.getElementsByClassName('modal__password')[0],
            registrationConfirmPasswordField = registrationForm.getElementsByClassName('modal__confirm-password')[0],
            registrationFields = registrationForm.querySelectorAll('.field'),
            authenticationFields = authenticationForm.querySelectorAll('.field');

        registrationForm.onsubmit = (event) => this.addUser(event, modal, registrationForm, registrationFields,
                                                            registrationUserNameField, registrationEmailField,
                                                            registrationPasswordField, registrationConfirmPasswordField, joinBtn, loginBtn, startBtn, headerWrapper, headerLogin);

        authenticationForm.onsubmit = (event) => this.defineUser(event, modal, authenticationForm, authenticationFields,
                                                                 authenticationUserNameField, authenticationPasswordField, joinBtn, loginBtn, startBtn, headerWrapper, headerLogin, plantsAmount);

        // ПЕРЕПИШУ НА ДЕЛЕГИРОВАНИЕ!!!!!!!!!!!!
        close.onclick = () => modal.classList.remove('active');
        joinCancelBtn.onclick = () => {
            modal.classList.remove('active');
            this.clearAddUser(registrationUserNameField, registrationEmailField,
                registrationPasswordField, registrationConfirmPasswordField);
        };
        loginCancelBtn.onclick = () => {
            modal.classList.remove('active');
            this.clearDefineUser(authenticationUserNameField, authenticationPasswordField);
        };

        joinBtn.onclick = () => this.showRegistrationModal(modal, modalTitle, joinTab, loginTab,
            registrationForm, authenticationForm);

        loginBtn.onclick = () => this.showAuthenticationModal(modal, modalTitle, joinTab, loginTab,
            registrationForm, authenticationForm);

        joinTab.onclick = () => this.showRegistrationForm(modalTitle, joinTab, loginTab,
            registrationForm, authenticationForm);

        loginTab.onclick = () => this.showAuthenticationForm(modalTitle, joinTab, loginTab,
            registrationForm, authenticationForm);
    }

    showRegistrationModal(modal, modalTitle, joinTab, loginTab, registrationForm, authenticationForm) {
        modal.classList.add('active');
        this.showRegistrationForm(modalTitle, joinTab, loginTab, registrationForm, authenticationForm);
    }

    showAuthenticationModal(modal, modalTitle, joinTab, loginTab, registrationForm, authenticationForm) {
        modal.classList.add('active');
        this.showAuthenticationForm(modalTitle, joinTab, loginTab, registrationForm, authenticationForm);
    }

    showRegistrationForm(modalTitle, joinTab, loginTab, registrationForm, authenticationForm) {
        modalTitle.innerHTML = 'Please fill in this form to create an account';
        joinTab.classList.add('active-tab');
        loginTab.classList.remove('active-tab');
        registrationForm.classList.add('active');
        authenticationForm.classList.remove('active');
    }

    showAuthenticationForm(modalTitle, joinTab, loginTab, registrationForm, authenticationForm) {
        modalTitle.innerHTML = 'Please login to start';
        joinTab.classList.remove('active-tab');
        loginTab.classList.add('active-tab');
        registrationForm.classList.remove('active');
        authenticationForm.classList.add('active');
    }

    async addUser(event, modal, registrationForm, registrationFields, registrationUserNameField, registrationEmailField,
                  registrationPasswordField, registrationConfirmPasswordField, joinBtn, loginBtn, startBtn, headerWrapper, headerLogin) {
        event.preventDefault();

        function removeValidation() {
            const errors = registrationForm.querySelectorAll('.modal__error');

            for (let i = 0; i < errors.length; i++) {
                errors[i].remove();
            }
        }

        removeValidation();

        let userName = registrationUserNameField.value.trim(),
            email = registrationEmailField.value.trim(),
            password = registrationPasswordField.value.trim(),
            confirmationPassword = registrationConfirmPasswordField.value.trim();

        let users = await this.model.getUsersList();


        if (isValidForm()) {
            let newUser = {
                username: registrationUserNameField.value.trim(),
                email: registrationEmailField.value.trim(),
                password: registrationPasswordField.value.trim(),
                status: 'Active'
            };

            this.user = await this.model.addUser(newUser);
            this.username = this.user.username;
            this.clearAddUser(registrationUserNameField, registrationEmailField,
                registrationPasswordField, registrationConfirmPasswordField);
            modal.classList.remove('active');

            joinBtn.classList.toggle('hidden');
            loginBtn.classList.toggle('hidden');
            startBtn.classList.toggle('hidden');
            headerWrapper.classList.remove('hidden');
            headerLogin.innerHTML = this.user.username;
            startBtn.insertAdjacentHTML('afterend','<p>You have successfully registered</p>');
        }

        function isValidForm() {
             if (!isUserExist()) {
                  if (isValidUsername(userName, 4, 12)) {

                          if (isValidEmail(email)) {
                              if (!isEmailExist(email)) {
                              if (isValidPassword(password, 20)) {
                                  if (isValidConfirmationPassword(password, confirmationPassword)) {
                                      return true;
                                  }
                              }
                           }
                      }
                  }
            }
            return false;
        }

        function isUserExist() {
            for (let i = 0; i < users.length; i++) {
                if (userName === users[i].username) {
                    registrationUserNameField.insertAdjacentHTML('afterend', '<p class="modal__error">This username is already taken</p>');
                    return true;
                }
            }
            return false;
        }

        function isEmailExist() {
            for (let i = 0; i < users.length; i++) {
                if (email === users[i].email) {
                    registrationEmailField.insertAdjacentHTML('afterend', '<p class="modal__error">This email address is already in use</p>');
                    return true;
                }
            }
            return false;
        }

        function isValidUsername(userName, minLength, maxLength) { // /^[a-z0-9_-]{3,16}$/
            if (userName === '') {
                registrationUserNameField.insertAdjacentHTML('afterend', '<p class="modal__error">This field is required</p>');
                return false;
            } else if (userName.length > maxLength) {
                registrationUserNameField.insertAdjacentHTML('afterend', `<p class="modal__error">Length of the field should be less than ${maxLength + 1} characters</p>`);
                return false;
            } else if (userName.length < minLength) {
                registrationUserNameField.insertAdjacentHTML('afterend', `<p class="modal__error">Length of the field should be more than ${minLength - 1} characters</p>`);
                return false;
            }
            return true;
        }

        function isValidEmail(email) {
            let pattern = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

            if (email === '') {
                registrationEmailField.insertAdjacentHTML('afterend', '<p class="modal__error">This field is required</p>');
                return false;
            } else if (!pattern.test(email)) {
                registrationEmailField.insertAdjacentHTML('afterend', '<p class="modal__error">Enter a valid e-mail address</p>');
                return false;
            }
            return true;
        }

        function isValidPassword(password, maxLength) {
            let pattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/;

            if (password === '') {
                registrationPasswordField.insertAdjacentHTML('afterend', '<p class="modal__error">This field is required</p>');
                return false;
            } else if (!pattern.test(password)) {
                registrationPasswordField.insertAdjacentHTML('afterend', '<p class="modal__error">Password must be at least 8 characters long contain a number and an uppercase letter example. Enter a valid password</p>');
                return false;
            } else if (password.length > maxLength) {
                registrationPasswordField.insertAdjacentHTML('afterend', `<p class="modal__error">Length of password should be less than ${maxLength + 1} characters</p>`);
                return false;
            }
            return true;
        }

        function isValidConfirmationPassword(password, confirmationPassword) {
            if (confirmationPassword === '') {
                registrationConfirmPasswordField.insertAdjacentHTML('afterend', '<p class="modal__error">This field is required</p>');
                return false;
            } else if (confirmationPassword !== password) {
                registrationConfirmPasswordField.insertAdjacentHTML('afterend', '<p class="modal__error">Password and confirm password don\'t match</p>');
                return false;
            }
            return true;
        }
    }

    clearAddUser(registrationUserNameField, registrationEmailField,
                 registrationPasswordField, registrationConfirmPasswordField) {

        registrationUserNameField.value = '';
        registrationEmailField.value = '';
        registrationPasswordField.value = '';
        registrationConfirmPasswordField.value = '';
    }

    async defineUser(event, modal, authenticationForm, authenticationFields,
                     authenticationUserNameField, authenticationPasswordField, joinBtn, loginBtn, startBtn, headerWrapper, headerLogin, plantsAmount) {
        event.preventDefault();
        let users = await this.model.getUsersList();

        let userName = authenticationUserNameField.value.trim(),
            password = authenticationPasswordField.value.trim();

        function removeValidation() {
            const errors = authenticationForm.querySelectorAll('.modal__error');

            for (let i = 0; i < errors.length; i++) {
                errors[i].remove();
            }
        }

        removeValidation();

        function isEmptyField() {
            for (let i = 0; i < authenticationFields.length; i++) {
                if (!authenticationFields[i].value) {
                    authenticationFields[i].insertAdjacentHTML('afterend', '<p class="modal__error">This field is required</p>');
                    return true;
                }
            }
            return false;
        }

        if (isValidForm()) {
            await Users.changeUserStatusActive(userName);

            await this.getUserData();
            await this.getData();
            const plantWordForm = (this.plants.length === 1) ? 'plant' : 'plants';
            plantsAmount.innerHTML = `${this.plants.length} ${plantWordForm}`;

            this.clearDefineUser(authenticationUserNameField, authenticationPasswordField);
            modal.classList.remove('active');

            joinBtn.classList.add('hidden');
            loginBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            headerWrapper.classList.remove('hidden');
            headerLogin.innerHTML = userName;
            startBtn.insertAdjacentHTML('afterend','<p>You have successfully logged in</p>');

        }

        function isValidForm() {
            if (!isEmptyField()) {
                if (isFindUser()) {
                    return true;
                }
            }
            return false;
        }

        function isFindUser() {
            for (let i = 0; i < users.length; i++) {
                if (userName === users[i].username && password === users[i].password) {
                    return true;
                }
            }
            authenticationPasswordField.insertAdjacentHTML('afterend', '<p class="modal__error">The username or password is incorrect</p>');
            return false;
        }
    }

    clearDefineUser(authenticationUserNameField, authenticationPasswordField) {
        authenticationUserNameField.value = '';
        authenticationPasswordField.value = '';
    }

}
export default About;