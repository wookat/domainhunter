import socket,json,sys
s=socket.create_connection(('127.0.0.1',29376))
s.sendall((json.dumps({'code':sys.stdin.read()})+'\n').encode())
print(s.makefile().readline())
