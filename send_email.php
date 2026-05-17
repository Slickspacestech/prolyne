<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'Forbidden.';
    exit;
}

$to      = 'info@prolyne.ca'; // Replace with actual email
$name    = strip_tags(trim($_POST['name']    ?? ''));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_SANITIZE_EMAIL);
$phone   = strip_tags(trim($_POST['phone']   ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Please complete all required fields.';
    exit;
}

$subject = "New Contact from Prolyne Website";
$body    = "Name: $name\n";
$body   .= "Email: $email\n";
if ($phone) $body .= "Phone: $phone\n";
$body   .= "\nMessage:\n$message\n";

$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo 'Message sent successfully.';
} else {
    http_response_code(500);
    echo 'Failed to send. Please try again.';
}
