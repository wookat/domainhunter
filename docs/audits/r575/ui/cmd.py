import socket,json,sys
s=socket.create_connection(('127.0.0.1',29375))
s.sendall((json.dumps({'code':sys.stdin.read()})+'\n').encode())
f=s.makefile()
print(f.readline())
