import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { BrandsComponent } from './components/brands/brands.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { DetailsComponent } from './components/details/details.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { AllordersComponent } from './components/allorders/allorders.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { detailsResolver } from './core/guards/details.resolver';
import { homeResolver } from './core/guards/home.resolver';
import { cartResolver } from './core/guards/cart.resolver';
import { brandsResolver } from './core/guards/brands.resolver';
import { SubCategoriesComponent } from './components/sub-categories/sub-categories.component';
import { subCategoriesResolver } from './core/guards/sub-categories.resolver';
import { homeProductsResolver } from './core/guards/home-products.resolver';
import { productsResolver } from './core/guards/products.resolver';
import { productsP2Resolver } from './core/guards/products-p2.resolver';
import { categoriesResolver } from './core/guards/categories.resolver';
import { brandsP2Resolver } from './core/guards/brands-p2.resolver';
import { allordersResolver } from './core/guards/allorders.resolver';

export const routes: Routes = [

    {
        path: "", component: AuthLayoutComponent, canActivate: [loggedGuard], children: [

            { path: "", redirectTo: "login", pathMatch: 'full' },
            { path: "login", component: LoginComponent, title: "Login" },
            { path: "register", component: RegisterComponent, title: "Register" },
            { path: "forgotPassword", component: ForgetPasswordComponent, title: "Forgot Password" },
        ]
    },

    {
        path: "", component: BlankLayoutComponent, canActivate: [authGuard], children: [
            { path: "", redirectTo: "home", pathMatch: 'full' },
            { path: "home", component: HomeComponent, title: "Fresh Cart", resolve: { resolver: homeResolver, resolverProducts: homeProductsResolver } },
            { path: "products", component: ProductComponent, title: "Products", resolve: { resolverP1: productsResolver, resolverP2: productsP2Resolver } },
            { path: "brands", component: BrandsComponent, title: "Brands", resolve: { resolver: brandsResolver, resolverP2: brandsP2Resolver } },
            { path: "categories", component: CategoriesComponent, title: "Categories", resolve: { resolver: categoriesResolver } },
            { path: "subCategories/:categoryId", component: SubCategoriesComponent, title: "Sub-Categories", resolve: { resolver: subCategoriesResolver } },
            { path: "details/:id", component: DetailsComponent, title: "Product Details", resolve: { resolver: detailsResolver } },

            { path: "cart", component: CartComponent, title: "Cart", resolve: { resolver: cartResolver } },
            { path: "shipping/:id", component: ShippingComponent, title: "Check Out" },
            { path: "allorders", component: AllordersComponent, title: "All Orders", resolve: { resolver: allordersResolver } },
        ]
    },


    { path: "**", component: NotFoundComponent }
];
