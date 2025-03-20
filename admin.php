<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alta Pinta - Panel de Administración</title>
    <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="admin.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <div class="nav-container">
            <div class="logo">Alta Pinta Admin</div>
            <button id="logout" class="btn secondary"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
        </div>
    </header>

    <section class="admin-section">
        <h1 class="section-title">Panel de Administración</h1>
        <div class="admin-container">
            <div class="menu-admin">
                <h2><i class="fas fa-utensils"></i> Gestionar Menú</h2>
                <form id="menu-form" class="admin-form">
                    <input type="hidden" id="sandwich-id">
                    <input type="text" id="sandwich-name" placeholder="Nombre" required>
                    <textarea id="sandwich-desc" placeholder="Descripción" required></textarea>
                    <input type="text" id="sandwich-price" placeholder="Precio" required>
                    <input type="text" id="sandwich-img" placeholder="URL de Imagen" required>
                    <button type="submit" class="btn"><i class="fas fa-save"></i> Guardar</button>
                </form>
                <div id="menu-list" class="item-list"></div>
            </div>
            <div class="order-admin">
                <h2><i class="fas fa-shopping-cart"></i> Pedidos</h2>
                <div id="order-list" class="item-list"></div>
            </div>
        </div>
    </section>

    <script src="admin.js"></script>
</body>
</html>