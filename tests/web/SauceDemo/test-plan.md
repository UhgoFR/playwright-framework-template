# Test Plan - SauceDemo

## Información del Sitio
- URL: https://www.saucedemo.com/
- Nombre de la Aplicación: SauceDemo
- Fecha de Análisis: 2026-03-10

## Paths Críticos Identificados
1. Login con credenciales válidas
2. Navegación y visualización del catálogo de productos
3. Adición de productos al carrito
4. Proceso de checkout completo
5. Confirmación de pedido
6. Logout del sistema

## Plan de Pruebas

### Login con credenciales válidas
- **Descripción**: Verificar que los usuarios pueden iniciar sesión con credenciales válidas
- **Pasos**: 
  1. Navegar a la página de login
  2. Ingresar username válido
  3. Ingresar password válido
  4. Click en botón Login
- **Resultado Esperado**: Usuario redirigido a la página de inventario

### Login con credenciales inválidas
- **Descripción**: Verificar que el sistema rechaza credenciales inválidas
- **Pasos**:
  1. Navegar a la página de login
  2. Ingresar username inválido
  3. Ingresar password inválido
  4. Click en botón Login
- **Resultado Esperado**: Mensaje de error displayed

### Visualización del catálogo de productos
- **Descripción**: Verificar que los productos se muestran correctamente en el inventario
- **Pasos**:
  1. Login con credenciales válidas
  2. Verificar que los productos se muestran
  3. Verificar nombre, descripción y precio de los productos
- **Resultado Esperado**: Todos los productos visibles con información correcta

### Adición de productos al carrito
- **Descripción**: Verificar que los productos pueden ser agregados al carrito
- **Pasos**:
  1. Login con credenciales válidas
  2. Click en "Add to cart" de un producto
  3. Verificar que el contador del carrito se actualiza
  4. Navegar al carrito
  5. Verificar que el producto está en el carrito
- **Resultado Esperado**: Producto agregado exitosamente al carrito

### Proceso de checkout completo
- **Descripción**: Verificar el flujo completo de checkout
- **Pasos**:
  1. Login con credenciales válidas
  2. Agregar producto al carrito
  3. Navegar al carrito
  4. Click en "Checkout"
  5. Completar información de envío
  6. Click en "Continue"
  7. Verificar resumen del pedido
  8. Click en "Finish"
- **Resultado Esperado**: Pedido completado exitosamente

### Logout del sistema
- **Descripción**: Verificar que los usuarios pueden cerrar sesión
- **Pasos**:
  1. Login con credenciales válidas
  2. Abrir menú de navegación
  3. Click en "Logout"
- **Resultado Esperado**: Usuario redirigido a la página de login
