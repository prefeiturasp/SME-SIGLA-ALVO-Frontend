import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 300px);
  padding: 2rem;
  width: 100%;
  background: transparent;
`;

export const PromoCard = styled.div`
  background: #ffffff !important;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

export const AlvoLogo = styled.img`
  max-width: 90px;
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
`;

export const Tagline = styled.p`
  color: #000000;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

export const DescriptionText = styled.p`
  color: #000000;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  text-align: left;
`;

export const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: #000000;
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    
    &::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #000000;
      font-size: 1.2rem;
    }
  }
`;
