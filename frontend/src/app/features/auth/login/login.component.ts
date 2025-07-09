import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      
      <!-- Header avec logo Gabon -->
      <div class="login-header">
        <div class="logo-container">
          <div class="flag-gabon">
            <div class="flag-green"></div>
            <div class="flag-yellow"></div>
            <div class="flag-blue"></div>
          </div>
          <h1>🚔 Police Main Courante</h1>
          <p>République Gabonaise</p>
        </div>
      </div>

      <!-- Formulaire de connexion -->
      <div class="login-card">
        <div class="card-header">
          <h2>Connexion Sécurisée</h2>
          <p>Accès réservé aux forces de l'ordre</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              <i class="material-icons">person</i>
              Email
            </label>
            <input 
              type="email" 
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="votre.email@police.ga"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email requis</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Format email invalide</span>
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="form-group">
            <label for="password" class="form-label">
              <i class="material-icons">lock</i>
              Mot de passe
            </label>
            <div class="password-container">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                class="form-control"
                formControlName="password"
                placeholder="••••••••"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword ? 'Masquer mot de passe' : 'Afficher mot de passe'">
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Mot de passe requis</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Minimum 6 caractères</span>
            </div>
          </div>

          <!-- Se souvenir de moi -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe">
              <span class="checkmark"></span>
              Se souvenir de moi
            </label>
          </div>

          <!-- Bouton de connexion -->
          <button 
            type="submit" 
            class="btn-login"
            [disabled]="loginForm.invalid || isLoading"
            [class.loading]="isLoading">
            
            <span *ngIf="!isLoading">
              <i class="material-icons">login</i>
              Se connecter
            </span>
            
            <span *ngIf="isLoading" class="loading-content">
              <div class="spinner"></div>
              Connexion en cours...
            </span>
          </button>

          <!-- Lien mot de passe oublié -->
          <div class="forgot-password">
            <a href="#" (click)="forgotPassword($event)">
              Mot de passe oublié ?
            </a>
          </div>

        </form>

        <!-- Message d'erreur global -->
        <div class="alert alert-error" *ngIf="errorMessage">
          <i class="material-icons">error</i>
          {{ errorMessage }}
        </div>

        <!-- Comptes de test -->
        <div class="test-accounts" *ngIf="!isProduction">
          <h4>Comptes de test :</h4>
          <div class="test-account" (click)="loginWithTest('admin')">
            <strong>Administrateur :</strong> admin@police.ga / Admin@123456
          </div>
          <div class="test-account" (click)="loginWithTest('agent')">
            <strong>Agent :</strong> agent@police.ga / Agent@123456
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>&copy; 2024 Police Nationale Gabonaise</p>
        <p>Système sécurisé - Version 2.0</p>
      </div>

    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #009639 100%);
      padding: var(--spacing-md);
      position: relative;
      overflow: auto;
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .logo-container h1 {
      font-size: 2.5rem;
      color: white;
      margin: var(--spacing-md) 0 var(--spacing-sm);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .logo-container p {
      color: rgba(255,255,255,0.9);
      font-size: 1.1rem;
      margin: 0;
    }

    .flag-gabon {
      display: inline-flex;
      width: 60px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      margin-bottom: var(--spacing-md);
    }

    .flag-green, .flag-yellow, .flag-blue {
      flex: 1;
      height: 100%;
    }

    .flag-green { background-color: #009639; }
    .flag-yellow { background-color: #fcd116; }
    .flag-blue { background-color: #3a75c4; }

    .login-card {
      max-width: 400px;
      width: 100%;
      margin: 0 auto;
      background: white;
      border-radius: var(--border-radius-xl);
      padding: var(--spacing-xl);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
    }

    .card-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .card-header h2 {
      color: var(--grey-800);
      margin-bottom: var(--spacing-sm);
      font-size: 1.75rem;
    }

    .card-header p {
      color: var(--grey-600);
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
      color: var(--grey-700);
    }

    .form-label i {
      font-size: 1.2rem;
      color: var(--primary-color);
    }

    .form-control {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid var(--grey-300);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-md);
      transition: all 0.2s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    .form-control.error {
      border-color: var(--error-color);
    }

    .password-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: var(--spacing-sm);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--grey-500);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: var(--primary-color);
    }

    .error-message {
      color: var(--error-color);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      gap: var(--spacing-sm);
    }

    .checkbox-label input[type="checkbox"] {
      appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid var(--grey-400);
      border-radius: 3px;
      position: relative;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"]:checked {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }

    .checkbox-label input[type="checkbox"]:checked::after {
      content: '✓';
      position: absolute;
      top: -2px;
      left: 1px;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .btn-login {
      width: 100%;
      padding: var(--spacing-md) var(--spacing-lg);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
      border: none;
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-md);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      min-height: 52px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .forgot-password {
      text-align: center;
      margin-top: var(--spacing-lg);
    }

    .forgot-password a {
      color: var(--primary-color);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: color 0.2s ease;
    }

    .forgot-password a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      margin-top: var(--spacing-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .alert-error {
      background: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
      border: 1px solid rgba(244, 67, 54, 0.2);
    }

    .test-accounts {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--grey-200);
    }

    .test-accounts h4 {
      color: var(--grey-700);
      margin-bottom: var(--spacing-md);
      font-size: var(--font-size-sm);
    }

    .test-account {
      padding: var(--spacing-sm);
      background: var(--grey-50);
      border-radius: var(--border-radius-sm);
      margin-bottom: var(--spacing-sm);
      cursor: pointer;
      font-size: var(--font-size-sm);
      transition: background-color 0.2s ease;
    }

    .test-account:hover {
      background: var(--grey-100);
    }

    .login-footer {
      text-align: center;
      margin-top: auto;
      padding-top: var(--spacing-xl);
      color: rgba(255,255,255,0.8);
      font-size: var(--font-size-sm);
    }

    .login-footer p {
      margin: var(--spacing-xs) 0;
    }

    /* Responsive mobile */
    @media (max-width: 768px) {
      .login-container {
        padding: var(--spacing-sm);
        justify-content: center;
      }

      .login-card {
        margin: var(--spacing-md) 0;
        padding: var(--spacing-lg);
      }

      .logo-container h1 {
        font-size: 2rem;
      }

      .card-header h2 {
        font-size: 1.5rem;
      }
    }

    /* Très petits écrans */
    @media (max-width: 480px) {
      .login-container {
        padding: var(--spacing-xs);
      }

      .login-card {
        padding: var(--spacing-md);
      }

      .logo-container h1 {
        font-size: 1.75rem;
      }
    }

    /* Mode paysage mobile */
    @media (max-height: 600px) and (orientation: landscape) {
      .login-container {
        padding: var(--spacing-sm) var(--spacing-md);
      }

      .login-header {
        margin-bottom: var(--spacing-md);
      }

      .logo-container h1 {
        font-size: 1.5rem;
        margin: var(--spacing-sm) 0;
      }

      .flag-gabon {
        width: 45px;
        height: 30px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  isProduction = false; // Pour afficher les comptes de test

  ngOnInit() {
    this.initializeForm();
    this.checkEnvironment();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['admin@police.ga', [Validators.required, Validators.email]],
      password: ['Admin@123456', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private checkEnvironment() {
    // En développement, afficher les comptes de test
    this.isProduction = false; // Change selon environnement
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  private performLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    // Simulation d'appel API
    setTimeout(() => {
      // Comptes de test valides
      const validAccounts = [
        { email: 'admin@police.ga', password: 'Admin@123456', role: 'admin' },
        { email: 'agent@police.ga', password: 'Agent@123456', role: 'agent' }
      ];

      const account = validAccounts.find(acc => 
        acc.email === email && acc.password === password
      );

      if (account) {
        // Connexion réussie
        console.log('Connexion réussie:', account);
        
        // Stocker les données utilisateur (simulation)
        localStorage.setItem('currentUser', JSON.stringify({
          email: account.email,
          role: account.role,
          nom: account.role === 'admin' ? 'Administrateur' : 'Agent',
          prenoms: 'Système',
          matricule: account.role === 'admin' ? 'ADM001' : 'AGT001'
        }));

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirection
        this.router.navigate(['/dashboard']);
      } else {
        // Erreur de connexion
        this.errorMessage = 'Email ou mot de passe incorrect';
      }

      this.isLoading = false;
    }, 1500); // Simulation délai réseau
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    alert('Fonctionnalité de récupération de mot de passe à implémenter.\n\nContactez votre administrateur système.');
  }

  loginWithTest(accountType: 'admin' | 'agent') {
    if (accountType === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@police.ga',
        password: 'Admin@123456'
      });
    } else {
      this.loginForm.patchValue({
        email: 'agent@police.ga',
        password: 'Agent@123456'
      });
    }
  }
}