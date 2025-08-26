import { describe, it, expect } from '@jest/globals';
import queryParamsSerializer, { capitalizeText, notNullParamsSerializer } from '../queryParamsSerializer';

describe('queryParamsSerializer', () => {
  describe('capitalizeText', () => {
    it('deve capitalizar a primeira letra de uma string', () => {
      expect(capitalizeText('ola')).toBe('Ola');
      expect(capitalizeText('mundo')).toBe('Mundo');
      expect(capitalizeText('teste')).toBe('Teste');
    });

    it('deve lidar com strings de um caractere', () => {
      expect(capitalizeText('a')).toBe('A');
      expect(capitalizeText('z')).toBe('Z');
    });

    it('deve lidar com string vazia', () => {
      expect(capitalizeText('')).toBe('');
    });

    it('deve lidar com strings já capitalizadas', () => {
      expect(capitalizeText('Ola')).toBe('Ola');
      expect(capitalizeText('MUNDO')).toBe('MUNDO');
    });

    it('deve lidar com strings com caracteres especiais', () => {
      expect(capitalizeText('123teste')).toBe('123teste');
      expect(capitalizeText('!ola')).toBe('!ola');
    });
  });

  describe('queryParamsSerializer - função principal', () => {
    it('deve serializar pares chave-valor simples', () => {
      const parametros = { nome: 'joao', idade: 25 };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&idade=25');
    });

    it('deve lidar com valores null retornando array vazio para essa chave', () => {
      const parametros = { nome: 'joao', idade: null, cidade: 'sp' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&cidade=sp');
    });

    it('deve lidar com valores de array', () => {
      const parametros = { tags: ['javascript', 'typescript'], categoria: 'programacao' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('tags=javascript&tags=typescript&categoria=programacao');
    });

    it('deve lidar com tipos mistos incluindo arrays e nulls', () => {
      const parametros = { 
        nome: 'joao', 
        idade: null, 
        tags: ['js', 'ts'], 
        ativo: true 
      };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&tags=js&tags=ts&ativo=true');
    });

    it('deve lidar com objeto vazio', () => {
      const parametros = {};
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('');
    });

    it('deve lidar com objeto com todos os valores null', () => {
      const parametros = { nome: null, idade: null };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('');
    });

    it('deve lidar com objeto com array vazio', () => {
      const parametros = { tags: [] };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('');
    });

    it('deve lidar com objeto com null misto e array vazio', () => {
      const parametros = { nome: null, tags: [], idade: 25 };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('idade=25');
    });

    it('deve lidar com valores numéricos', () => {
      const parametros = { id: 123, contador: 0, preco: 99.99 };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('id=123&contador=0&preco=99.99');
    });

    it('deve lidar com valores booleanos', () => {
      const parametros = { ativo: true, verificado: false };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('ativo=true&verificado=false');
    });

    it('deve lidar com valores undefined (serializando-os como "undefined")', () => {
      const parametros = { nome: 'joao', idade: undefined as any };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&idade=undefined');
    });

    it('deve lidar com valores de objeto aninhados complexos', () => {
      const parametros = { 
        usuario: { nome: 'joao', idade: 25 } as any,
        configuracoes: { tema: 'escuro' } as any
      };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('usuario=[object Object]&configuracoes=[object Object]');
    });

    it('deve lidar com valores de função', () => {
      const funcao = () => 'teste';
      const parametros = { callback: funcao as any };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('callback=() => \'teste\'');
    });
  });

  describe('queryParamsSerializer - capitalização da chave sort', () => {
    it('deve capitalizar valores do parâmetro sort', () => {
      const parametros = { sort: 'nome', ordem: 'asc' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('sort=Nome&ordem=asc');
    });

    it('deve capitalizar valores do parâmetro sort em arrays', () => {
      const parametros = { sort: ['nome', 'idade'], ordem: 'desc' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('sort=Nome&sort=Idade&ordem=desc');
    });

    it('não deve capitalizar parâmetros que não são sort', () => {
      const parametros = { sort: 'nome', filtro: 'ativo', ordem: 'asc' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('sort=Nome&filtro=ativo&ordem=asc');
    });

    it('deve lidar com parâmetro sort com valor null', () => {
      const parametros = { sort: null, filtro: 'ativo' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('filtro=ativo');
    });

    it('deve lidar com parâmetro sort com array vazio', () => {
      const parametros = { sort: [], filtro: 'ativo' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('filtro=ativo');
    });
  });

  describe('notNullParamsSerializer', () => {
    it('deve filtrar valores null do objeto', () => {
      const parametros = { nome: 'joao', idade: null, cidade: 'sp', status: null };
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual({ nome: 'joao', cidade: 'sp' });
    });

    it('deve retornar objeto vazio quando todos os valores são null', () => {
      const parametros = { nome: null, idade: null };
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual({});
    });

    it('deve retornar o mesmo objeto quando não há valores null', () => {
      const parametros = { nome: 'joao', idade: 25, ativo: true };
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual(parametros);
    });

    it('deve lidar com objeto vazio', () => {
      const parametros = {};
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual({});
    });

    it('deve lidar com valores undefined (tratando-os como null)', () => {
      const parametros = { nome: 'joao', idade: undefined as any, cidade: 'sp' };
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual({ nome: 'joao', cidade: 'sp' });
    });

    it('deve preservar valores falsy que não são null', () => {
      const parametros = { 
        nome: '', 
        idade: 0, 
        ativo: false, 
        tags: [], 
        valor: null 
      };
      const resultado = notNullParamsSerializer(parametros);
      expect(resultado).toEqual({ 
        nome: '', 
        idade: 0, 
        ativo: false, 
        tags: [] 
      });
    });

    it('deve lidar com valores complexos que não são null', () => {
      const parametros = { 
        usuario: { nome: 'joao' }, 
        tags: ['js', 'ts'], 
        callback: () => {}, 
        valor: null 
      };
      const resultado = notNullParamsSerializer(parametros);

      const esperado = { 
        usuario: { nome: 'joao' }, 
        tags: ['js', 'ts']
      };
      
      expect(resultado).toHaveProperty('usuario', { nome: 'joao' });
      expect(resultado).toHaveProperty('tags', ['js', 'ts']);
      expect(resultado).toHaveProperty('callback');
      expect(typeof resultado.callback).toBe('function');
      expect(resultado).not.toHaveProperty('valor');
    });
  });

  describe('Casos extremos e tratamento de erros', () => {
    it('deve lidar com objeto com chaves de símbolo', () => {
      const chaveSimbolo = Symbol('teste');
      const parametros = { [chaveSimbolo]: 'valor', nome: 'joao' } as any;
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao');
    });

    it('deve lidar com objeto com propriedades getter', () => {
      const parametros = Object.defineProperty({}, 'nome', {
        get: () => 'joao',
        enumerable: true
      });
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao');
    });

    it('deve lidar com objeto com propriedades não-enumeráveis', () => {
      const parametros = Object.defineProperty({ nome: 'joao' }, 'idade', {
        value: 25,
        enumerable: false
      });
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao');
    });

    it('deve lidar com objeto com propriedades herdadas', () => {
      const pai = { nome: 'pai' };
      const filho = Object.create(pai);
      filho.idade = 25;
      const resultado = queryParamsSerializer(filho);
      expect(resultado).toBe('idade=25');
    });

    it('deve lidar com objeto com referência circular graciosamente', () => {
      const parametros: any = { nome: 'joao' };
      parametros.self = parametros;

      expect(() => queryParamsSerializer(parametros)).not.toThrow();
    });

    it('deve lidar com objetos muito grandes', () => {
      const parametros: any = {};
      for (let i = 0; i < 1000; i++) {
        parametros[`chave${i}`] = `valor${i}`;
      }
      
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toContain('chave0=valor0');
      expect(resultado).toContain('chave999=valor999');
      expect(resultado.split('&')).toHaveLength(1000);
    });
  });

  describe('Segurança de tipos e constraints genéricos', () => {
    it('deve funcionar com tipo Record<string, any>', () => {
      const parametros: Record<string, any> = { nome: 'joao', idade: 25 };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&idade=25');
    });

    it('deve funcionar com tipos de interface', () => {
      interface ParametrosUsuario {
        nome: string;
        idade: number;
        ativo: boolean;
      }
      
      const parametros: ParametrosUsuario = { nome: 'joao', idade: 25, ativo: true };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('nome=joao&idade=25&ativo=true');
    });

    it('deve funcionar com tipos de união', () => {
      type Status = 'ativo' | 'inativo';
      const parametros = { status: 'ativo' as Status, nome: 'joao' };
      const resultado = queryParamsSerializer(parametros);
      expect(resultado).toBe('status=ativo&nome=joao');
    });
  });
});
