import { createServer } from 'http';
import { AddressInfo } from 'net';
import { Server } from 'socket.io';
import Client, { Socket as ClientSocket } from 'socket.io-client';
import { addSocket, getGameSockets, getSockets } from '../SocketManager';

describe('Tests for Socket Helper', () => {
  let io: Server | null = null;
  let clientSocketA: ClientSocket | null = null;
  let clientSocketB: ClientSocket | null = null;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    httpServer.listen(() => {
      if (httpServer && io) {
        const address = httpServer.address() as AddressInfo;

        if (address) {
          clientSocketA = Client(`http://localhost:${address.port}`);

          io.on('connection', (socket) => {
            addSocket(socket);
          });

          clientSocketA.on('connect', () => {
            clientSocketB = Client(`http://localhost:${address.port}`);
            clientSocketB.on('connect', done);
          });
        }
      }
    });
  });

  afterAll(() => {
    if (io && clientSocketA && clientSocketB) {
      io.close();
      clientSocketA.close();
      clientSocketB.close();
    }
  });

  test('there are two client sockets', () => {
    expect(clientSocketA).toBeDefined();
    expect(clientSocketB).toBeDefined();
    expect(getSockets().size).toBe(2);
  });

  test('we get all sockets from the list', () => {
    const allSockets = getSockets();
    const keys = [...allSockets.keys()];
    const gameSockets = getGameSockets([keys[0]]);
    expect(gameSockets.size).toBe(1);
    expect(gameSockets.get(keys[0])?.id).toBe(keys[0]);
  });

  it('should receive a message from client', (done) => {
    if (clientSocketA && getSockets().size > 0) {
      clientSocketA.on('hello', (arg) => {
        expect(arg).toBe('world');
        done();
      });
      getSockets().values().next().value.emit('hello', 'world');
    }
    done();
  });
});
