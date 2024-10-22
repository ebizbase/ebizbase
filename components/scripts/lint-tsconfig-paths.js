const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Đường dẫn tới tệp tsconfig.base.json
const ROOT_PATH = path.join(__dirname, '../..');
const TS_CONFIG_BASE_PATH = path.join(ROOT_PATH, 'tsconfig.base.json');

// Đọc tệp tsconfig.base.json
fs.readFile(TS_CONFIG_BASE_PATH, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading tsconfig.base.json:', err);
    return;
  }

  // Phân tích cú pháp JSON
  let tsconfig;
  try {
    tsconfig = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing tsconfig.base.json:', parseErr);
    return;
  }

  // Lấy các đường dẫn từ thuộc tính paths
  const paths = tsconfig.compilerOptions?.paths;
  if (!paths) {
    console.error('No paths found in tsconfig.base.json');
    return;
  }

  // Kiểm tra sự tồn tại của từng đường dẫn
  const nonExistentPaths = [];
  console.log('\nChecking paths...');
  Object.entries(paths).forEach(([alias, [relativePath]]) => {
    const absolutePath = path.join(ROOT_PATH, relativePath);
    if (!fs.existsSync(absolutePath)) {
      if (process.argv.includes('--fix')) {
        console.warn(`⚠️ Path does not exist: ${absolutePath}`);
      } else {
        console.error(`⛔ Path does not exist: ${absolutePath}`);
      }
      nonExistentPaths.push(alias);
    }
  });

  if (nonExistentPaths.length === 0) {
    console.log('✅ All paths exist\n');
  }

  // Nếu có argument --fix, xóa các đường dẫn không tồn tại và cập nhật tệp tsconfig.base.json
  if (process.argv.includes('--fix') && nonExistentPaths.length > 0) {
    nonExistentPaths.forEach((alias) => {
      delete paths[alias];
    });

    // Ghi lại tệp tsconfig.base.json
    fs.writeFile(TS_CONFIG_BASE_PATH, JSON.stringify(tsconfig, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing tsconfig.base.json:', writeErr);
        return;
      }

      console.log('Updated tsconfig.base.json');

      // Thêm tệp đã cập nhật vào git
      exec(`git add ${TS_CONFIG_BASE_PATH}`, (gitErr, stdout, stderr) => {
        if (gitErr) {
          console.error('Error adding file to git:', gitErr);
          return;
        }
        console.log('File added to git:', stdout);
      });
    });
  }
});
