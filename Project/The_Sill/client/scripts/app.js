import '../styles/app';

import {parseCurrentURL} from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import AddAndList from './views/pages/plants/add-list.js';
import Info from './views/pages/plants/info.js';
import Edit from './views/pages/plants/edit.js';

import About from './views/pages/about.js';
import Error404 from './views/pages/error404.js';

const Routes = {
    '/': About,
    '/plants': AddAndList,
    '/plant/:id': Info,
    '/plant/:id/edit': Edit
};

function router() {
    (async() => {
        const headerContainer = document.getElementsByClassName('header-container')[0],
            contentContainer = document.getElementsByClassName('content-container')[0],
            header = new Header();

        const urlParts = parseCurrentURL(),
            pagePath = `/${urlParts.page || ''}${urlParts.id ? '/:id' : ''}${urlParts.action ? `/${urlParts.action}` : ''}`,
            page = Routes[pagePath] ? new Routes[pagePath]() : new Error404();

        const pageUserData = await page.getUserData();

        const pageData = await page.getData();

        const pageInstanceData = await page.getInstanceData();

        const pageDateData = page.getDateData();

        const pageAdditionalData = await page.getAdditionalData();

        headerContainer.innerHTML = await header.render(pageData, pageInstanceData, pageUserData, pageAdditionalData);

        contentContainer.innerHTML = await page.render(pageData, pageInstanceData, pageUserData, pageDateData, pageAdditionalData);

        header.afterRender();
        page.afterRender();
    })();
}

(async() => {
    const footerContainer = document.getElementsByClassName('footer-container')[0],
        footer = new Footer();

    footerContainer.innerHTML = await footer.render();
})();

module.hot ? module.hot.accept(router()) : (window.onload = router);
window.onhashchange = router;

// для прелоадера
window.onload = (() => {
    document.body.classList.add('loaded-hiding');

    window.setTimeout(() => {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded-hiding');
    }, 500);
});