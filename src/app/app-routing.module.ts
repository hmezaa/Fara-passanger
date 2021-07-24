import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ForwordGuard } from './forward.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login-selection',
    pathMatch: 'full'
  },
  {
    path: 'register/:phoneNumber',
    canActivate: [AuthGuard],
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'otp-confirmation/:phoneNumber',
    canActivate: [AuthGuard],
    loadChildren: () => import('./otp-confirmation/otp-confirmation.module').then(m => m.OtpConfirmationPageModule)
  },
  {
    path: 'login-via-phone',
    canActivate: [AuthGuard],
    loadChildren: () => import('./login-via-phone/login-via-phone.module').then(m => m.LoginViaPhonePageModule)
  },
  {
    path: 'login-selection',
    canActivate: [AuthGuard],
    loadChildren: () => import('./login-selection/login-selection.module').then(m => m.LoginSelectionPageModule)
  },
  {
    path: 'search-location',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./search-location/search-location.module').then(m => m.SearchLocationPageModule)
  },
  {
    path: 'addnewlocation',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./addnewlocation/addnewlocation.module').then(m => m.AddnewlocationPageModule)
  },
  {
    path: 'reserve-booking-confirmation',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./reserve-booking-confirmation/reserve-booking-confirmation.module').then(m => m.ReserveBookingConfirmationPageModule)
  },
  {
    path: 'ask-payment-way',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./ask-payment-way/ask-payment-way.module').then(m => m.AskPaymentWayPageModule)
  },
  {
    path: 'my-bookings',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./my-bookings/my-bookings.module').then(m => m.MyBookingsPageModule)
  },
  {
    path: 'trip-details',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./trip-details/trip-details.module').then(m => m.TripDetailsPageModule)
  },
  {
    path: 'reserved-bookings',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./reserved-bookings/reserved-bookings.module').then(m => m.ReservedBookingsPageModule)
  },
  {
    path: 'add-payment-methods',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./add-payment-methods/add-payment-methods.module').then(m => m.AddPaymentMethodsPageModule)
  },
  {
    path: 'payment-methods',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'profile',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'help-and-support',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./help-and-support/help-and-support.module').then(m => m.HelpAndSupportPageModule)
  },
  {
    path: 'rating',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./rating/rating.module').then(m => m.RatingPageModule)
  },
  {
    path: 'chat/:name/:id',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'cancel-ride',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./cancel-ride/cancel-ride.module').then(m => m.CancelRidePageModule)
  },
  {
    path: 'edit-profile',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'preferences',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./preferences/preferences.module').then(m => m.PreferencesPageModule)
  },
  {
    path: 'contact-us',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: 'about-us',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsPageModule)
  },   {
    path: 'booking-options',
    loadChildren: () => import('./booking-options/booking-options.module').then( m => m.BookingOptionsPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'vehicle-types-listing',
    loadChildren: () => import('./vehicle-types-listing/vehicle-types-listing.module').then( m => m.VehicleTypesListingPageModule)
  },
  {
    path: 'tracking2',
    loadChildren: () => import('./tracking2/tracking2.module').then( m => m.Tracking2PageModule)
  },
  {
    path: 'voice-modal',
    loadChildren: () => import('./voice-modal/voice-modal.module').then( m => m.VoiceModalPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
