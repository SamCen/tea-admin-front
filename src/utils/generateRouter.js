function generate(routes, menus) {
    menus.forEach(menu => {
        let route = Object.assign({}, menu);
        if (menu.path) {
            if (menu.component) {
                route.component = () => import(`../views/${menu.component}.vue`);
                routes.push(route);
            }
        } else {
            if (menu.children) {
                generate(routes, menu.children);
            }
        }
    })
}

export default (routes, menus) => {
    generate(routes, menus);
}
