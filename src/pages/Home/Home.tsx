import { Typography } from "antd";
import BaseScreen, { type TitleItem } from "../BaseScreen";


const { Text } = Typography;
const breadcrumbItems = [
  {
    title: <a href="/"><Text strong>Home</Text></a>,
  },
] as TitleItem[];

export const Home: React.FC = () => (

    <BaseScreen breadcrumbItems={breadcrumbItems}  title='Página inicial'>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue, libero non vestibulum faucibus, diam purus efficitur sapien, ut sagittis quam lacus id velit. Donec arcu justo, feugiat cursus auctor aliquam, condimentum vel leo. Nulla lacinia urna molestie bibendum aliquet. Suspendisse potenti. In vestibulum auctor maximus. Nulla pellentesque a erat venenatis bibendum. Curabitur in mi lacus. Sed tincidunt interdum mi vel blandit. Nunc nec lacinia tellus. Fusce tincidunt pretium nibh a efficitur. Suspendisse auctor lobortis nibh, sit amet pretium nisl convallis non. Aenean congue dignissim justo, sed dictum dui pharetra ut. Nam lacinia, arcu euismod interdum vehicula, tortor nunc porta sem, mattis pellentesque eros odio vitae leo.</p>

        <p>Donec lobortis, lacus vel hendrerit sollicitudin, mi quam vehicula lacus, vitae lobortis neque tellus sit amet ex. Fusce quam nisi, imperdiet eget sagittis ac, ultrices non sapien. Etiam interdum dolor non laoreet placerat. Curabitur tristique lorem ex, sit amet sagittis metus dapibus sed. Aliquam posuere, elit ac semper feugiat, dolor odio eleifend ligula, venenatis iaculis lorem enim scelerisque leo. Proin sit amet neque nisi. Cras maximus tellus in felis accumsan rutrum. Quisque placerat elit luctus massa dapibus ullamcorper. Integer eleifend, risus ac dignissim feugiat, diam urna lobortis diam, ultrices venenatis sem massa vel tellus. Curabitur et facilisis purus, a dictum nunc.</p>
    </BaseScreen>

 );
