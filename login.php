<?php
session_start();

if (isset($_POST['logout'])) {
    session_destroy();
    header("Location: login.php");
    exit;
}

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: admin.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && !isset($_POST['logout'])) {
    $username = "admin"; // Cambiar por tu usuario real
    $password = "12345"; // Cambiar por tu contraseña real

    if ($_POST['username'] === $username && $_POST['password'] === $password) {
        $_SESSION['loggedin'] = true;
        header("Location: admin.php");
        exit;
    } else {
        $error = "Usuario o contraseña incorrectos.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alta Pinta - Login</title>
    <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #ff6200, #ff8c00); }
        .login-container { background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); width: 90%; max-width: 400px; text-align: center; }
        h1 { font-size: 2rem; color: #ff6200; margin-bottom: 1.5rem; }
        form { display: flex; flex-direction: column; gap: 1rem; }
        input { padding: 0.8rem; border: 2px solid #ff6200; border-radius: 15px; font-size: 1rem; }
        button { padding: 0.8rem; background: #ff6200; color: white; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
        button:hover { background: #e65b00; }
        .error { color: red; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="login-container">
        <h1><i class="fas fa-lock"></i> Login Admin</h1>
        <form method="POST">
            <input type="text" name="username" placeholder="Usuario" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
        </form>
        <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
    </div>
</body>
</html>