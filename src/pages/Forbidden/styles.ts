import { Layout } from 'antd';
import styled from 'styled-components';

export const Container = styled(Layout)`
  max-height: 100%;
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  height: 100%;
  margin: 1.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;

  button {
    width: 9.875rem;
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;

  h1 {
    color: rgba(0, 0, 0, 0.85);
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 2rem;
  }

  h3 {
    color: rgba(0, 0, 0, 0.45);
    font-size: 0.87rem;
    font-weight: 400;
    line-height: 1.5rem;
  }
`;
