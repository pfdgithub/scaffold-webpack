echo "生成私钥 key.pem"
openssl genrsa -out key.pem 2048

echo "生成证书签名请求 csr.pem"
openssl req -new -batch -key key.pem -out csr.pem

echo "生成生成自签名证书 csr.pem"
openssl req -x509 -batch -days 10000 -key key.pem -in csr.pem -out cert.pem

read -n1 -p "Press any key to continue..."