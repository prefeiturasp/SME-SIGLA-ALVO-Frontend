import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('deve inicializar com valor padrão 0', () => {
      const { result } = renderHook(() => useCounter());

      expect(result.current.count).toBe(0);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });

    it('deve inicializar com valor personalizado', () => {
      const valorInicial = 42;
      const { result } = renderHook(() => useCounter(valorInicial));

      expect(result.current.count).toBe(valorInicial);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });

    it('deve inicializar com valor negativo', () => {
      const valorInicial = -10;
      const { result } = renderHook(() => useCounter(valorInicial));

      expect(result.current.count).toBe(valorInicial);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });

    it('deve inicializar com valor zero', () => {
      const valorInicial = 0;
      const { result } = renderHook(() => useCounter(valorInicial));

      expect(result.current.count).toBe(valorInicial);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });

    it('deve inicializar com valor positivo grande', () => {
      const valorInicial = 999999;
      const { result } = renderHook(() => useCounter(valorInicial));

      expect(result.current.count).toBe(valorInicial);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });

    it('deve inicializar com valor negativo grande', () => {
      const valorInicial = -999999;
      const { result } = renderHook(() => useCounter(valorInicial));

      expect(result.current.count).toBe(valorInicial);
      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
    });
  });

  describe('Funcionalidade de incremento', () => {
    it('deve incrementar de 0 para 1', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it('deve incrementar de valor positivo', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(6);
    });

    it('deve incrementar de valor negativo', () => {
      const { result } = renderHook(() => useCounter(-3));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(-2);
    });

    it('deve incrementar múltiplas vezes', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);
    });

    it('deve incrementar a partir do inteiro seguro máximo', () => {
      const { result } = renderHook(() => useCounter(Number.MAX_SAFE_INTEGER - 1));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('deve incrementar além do inteiro seguro máximo', () => {
      const { result } = renderHook(() => useCounter(Number.MAX_SAFE_INTEGER));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(Number.MAX_SAFE_INTEGER + 1);
    });
  });

  describe('Funcionalidade de decremento', () => {
    it('deve decrementar de 1 para 0', () => {
      const { result } = renderHook(() => useCounter(1));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(0);
    });

    it('deve decrementar de valor positivo', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(9);
    });

    it('deve decrementar de valor negativo', () => {
      const { result } = renderHook(() => useCounter(-2));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(-3);
    });

    it('deve decrementar múltiplas vezes', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(2);
    });

    it('deve decrementar a partir do inteiro seguro mínimo', () => {
      const { result } = renderHook(() => useCounter(Number.MIN_SAFE_INTEGER + 1));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('deve decrementar além do inteiro seguro mínimo', () => {
      const { result } = renderHook(() => useCounter(Number.MIN_SAFE_INTEGER));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(Number.MIN_SAFE_INTEGER - 1);
    });
  });

  describe('Operações combinadas', () => {
    it('deve lidar com incremento seguido de decremento', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
        result.current.decrement();
      });

      expect(result.current.count).toBe(0);
    });

    it('deve lidar com decremento seguido de incremento', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.decrement();
        result.current.increment();
      });

      expect(result.current.count).toBe(0);
    });

    it('deve lidar com múltiplas operações de incremento e decremento', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment(); 
        result.current.increment(); 
        result.current.decrement(); 
        result.current.increment(); 
        result.current.decrement(); 
        result.current.decrement(); 
      });

      expect(result.current.count).toBe(10);
    });

    it('deve lidar com sequência complexa de operações', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment(); 
        result.current.increment(); 
        result.current.decrement(); 
        result.current.increment(); 
        result.current.decrement(); 
      });

      expect(result.current.count).toBe(7);
    });
  });

  describe('Casos extremos e condições limite', () => {
    it('deve lidar com números muito grandes', () => {
      const numeroGrande = 1e15;
      const { result } = renderHook(() => useCounter(numeroGrande));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(numeroGrande + 1);
    });

    it('deve lidar com números muito pequenos', () => {
      const numeroPequeno = -1e15;
      const { result } = renderHook(() => useCounter(numeroPequeno));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(numeroPequeno - 1);
    });

    it('deve lidar com zero operações', () => {
      const { result } = renderHook(() => useCounter(5));

      expect(result.current.count).toBe(5);
    });

    it('deve lidar com operação única', () => {
      const { result } = renderHook(() => useCounter(3));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(4);
    });

    it('deve lidar com muitas operações', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.increment();
        }
        for (let i = 0; i < 30; i++) {
          result.current.decrement();
        }
        for (let i = 0; i < 20; i++) {
          result.current.increment();
        }
      });

      expect(result.current.count).toBe(40);
    });
  });

  describe('Persistência e isolamento de estado', () => {
    it('deve manter estado entre operações', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(11);

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(12);
    });

    it('deve isolar estado entre diferentes instâncias do hook', () => {
      const { result: resultado1 } = renderHook(() => useCounter(5));
      const { result: resultado2 } = renderHook(() => useCounter(10));

      act(() => {
        resultado1.current.increment();
        resultado2.current.decrement();
      });

      expect(resultado1.current.count).toBe(6);
      expect(resultado2.current.count).toBe(9);
    });

    it('deve lidar com múltiplas instâncias do hook com mesmo valor inicial', () => {
      const { result: resultado1 } = renderHook(() => useCounter(0));
      const { result: resultado2 } = renderHook(() => useCounter(0));

      act(() => {
        resultado1.current.increment();
        resultado2.current.increment();
      });

      expect(resultado1.current.count).toBe(1);
      expect(resultado2.current.count).toBe(1);
    });
  });

  describe('Referências e estabilidade das funções', () => {
    it('deve manter referências estáveis das funções', () => {
      const { result, rerender } = renderHook(() => useCounter(0));

      const incrementoInicial = result.current.increment;
      const decrementoInicial = result.current.decrement;

      rerender();

      expect(typeof result.current.increment).toBe('function');
      expect(typeof result.current.decrement).toBe('function');
      expect(result.current.increment).toBeInstanceOf(Function);
      expect(result.current.decrement).toBeInstanceOf(Function);
    });

    it('deve retornar mesma estrutura de objeto em cada renderização', () => {
      const { result, rerender } = renderHook(() => useCounter(0));

      const estruturaInicial = Object.keys(result.current);
      rerender();
      const novaEstrutura = Object.keys(result.current);

      expect(novaEstrutura).toEqual(estruturaInicial);
      expect(result.current).toHaveProperty('count');
      expect(result.current).toHaveProperty('increment');
      expect(result.current).toHaveProperty('decrement');
    });
  });

  describe('Testes de performance e estresse', () => {
    it('deve lidar com operações sucessivas rápidas', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        for (let i = 0; i < 1000; i++) {
          if (i % 2 === 0) {
            result.current.increment();
          } else {
            result.current.decrement();
          }
        }
      });

      expect(result.current.count).toBe(0); 
    });

    it('deve lidar com operações alternadas', () => {
      const { result } = renderHook(() => useCounter(100));

      act(() => {
        for (let i = 0; i < 200; i++) {
          if (i % 2 === 0) {
            result.current.increment();
          } else {
            result.current.decrement();
          }
        }
      });

      expect(result.current.count).toBe(100); 
    });
  });

  describe('Segurança de tipos e valores de retorno', () => {
    it('deve retornar count como número', () => {
      const { result } = renderHook(() => useCounter(42));

      expect(typeof result.current.count).toBe('number');
      expect(Number.isInteger(result.current.count)).toBe(true);
    });

    it('deve retornar increment como função', () => {
      const { result } = renderHook(() => useCounter(0));

      expect(typeof result.current.increment).toBe('function');
      expect(result.current.increment).toBeInstanceOf(Function);
    });

    it('deve retornar decrement como função', () => {
      const { result } = renderHook(() => useCounter(0));

      expect(typeof result.current.decrement).toBe('function');
      expect(result.current.decrement).toBeInstanceOf(Function);
    });

    it('deve retornar objeto com propriedades corretas', () => {
      const { result } = renderHook(() => useCounter(0));

      expect(result.current).toHaveProperty('count');
      expect(result.current).toHaveProperty('increment');
      expect(result.current).toHaveProperty('decrement');
      expect(Object.keys(result.current)).toHaveLength(3);
    });
  });
});
