import { LayoutMain } from '@/layout/main/LayoutMain';
import { LayoutPageEdit } from '@/layout/page/LayoutPageEdit'

const PageUserEdit = () => {
  return (
    <LayoutMain>
      <LayoutPageEdit entity='user' viewType='user' />
    </LayoutMain>
  );
};

export default PageUserEdit;