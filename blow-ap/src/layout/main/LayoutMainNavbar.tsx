import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  Link,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/react';
import { useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';

import { useLogout } from '@/redux/services/auth/hooks';
import projectConfig from '@/config/projectConfig';

export const LayoutMainNavbar = () => {
  const [isMenuOpen] = useState(false);

  const logout = useLogout();

  const menuRoutes = projectConfig.routes.filter((item: any) => item.menu);
  const menuItems = menuRoutes.map((item: any) => ({
    path: item.path,
    label: item.name,
  }));

  return (
    <Navbar isBordered className="shadow-sm" isBlurred={false} maxWidth="full">
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="mr-2" />
        <NavbarBrand className="">
          <img
            alt="Logo"
            className="h-[36px] min-w-[100px] w-auto"
            src="https://api.blow.ru/core/BLOW%201.png"
          />
        </NavbarBrand>
      </NavbarContent>

      {/* <NavbarContent className="hidden sm:flex gap-[50px] text-[12px]" justify="center">
				<NavbarItem className="cursor-pointer">
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? "text-primary" : "text-foreground"
						}
					>
						Пользователи
					</NavLink>
				</NavbarItem>
				<NavbarItem className="cursor-pointer">
					<NavLink
						to="/services"
						className={({ isActive }) =>
							isActive ? "text-primary" : "text-foreground"
						}
					>
						Услуги и оплаты
					</NavLink>
				</NavbarItem>
				<NavbarItem className="cursor-pointer">
					<NavLink
						to="/moderation"
						className={({ isActive }) =>
							isActive ? "text-primary" : "text-foreground"
						}
					>
						Модерация
					</NavLink>
				</NavbarItem>
			</NavbarContent> */}

      <NavbarContent as="div" className="items-center" justify="end">
        {/* <ThemeSwitcher /> */}
        {/* <SearchRoundedButton
                className="flex sm:hidden"
                onClick={() => {
                  dispatch(setSearchOpen(!ui.searchOpen));
                }}
              /> */}
        {/* <Input
                classNames={{
                  base: "hidden sm:block max-w-full sm:max-w-[15rem]",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper:
                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                placeholder="Найти..."
                size="sm"
                radius="full"
                startContent={<SearchIcon size={18} />}
                type="search"
                value={ui?.searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
              /> */}

        {/* <Dropdown placement="bottom-end"> */}
        {/* <Badge
									isOneChar
									content={<NotificationIcon size={12} />}
									color="secondary"
									shape="circle"
									placement="top-right"
									isInvisible={!messages}
								> */}
        {/* <DropdownTrigger>
                  <div className="flex items-center gap-1.5 pr-1.5 cursor-pointer group">
                    <div className="group-hover:text-secondary hidden sm:flex">
                      {user?.firstName || ""}
                    </div>
                    <Avatar
                      as="button"
                      className="transition-transform text-base font-[700]"
                      color="secondary"
                      name={user?.firstName || ""}
                      size="sm"
                      // src={user?.photoUrl ? MEDIA_URL + me.photoUrl : ""}
                    />
                  </div>
                </DropdownTrigger> */}
        {/* </Badge> */}

        {/* <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="settings"
                    startContent={<LuCircleUserRound />}
                    onPress={onOpenView}
                  >
                    Профиль
                  </DropdownItem>
                  <DropdownItem
                    key="team_settings"
                    startContent={<LuMessageCircle className="text-zinc-400" />}
                    onPress={() => setMessages(0)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400">Сообщения</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="analytics"
                    startContent={<LuEuro className="text-zinc-400" />}
                  >
                    <p className="text-zinc-400">Финансы</p>
                  </DropdownItem>
                  <DropdownItem
                    key="system"
                    startContent={<LuCircleHelp className="text-zinc-400" />}
                  >
                    <p className="text-zinc-400">Помощь</p>
                  </DropdownItem>
                  <DropdownItem
                    key="system"
                    startContent={<LuSettings className="text-zinc-400" />}
                  >
                    <p className="text-zinc-400">Настройки</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="mt-3"
                    onPress={logout}
                    startContent={<LuLogOut />}
                  >
                    Выйти
                  </DropdownItem>
                </DropdownMenu> */}
        {/* </Dropdown> */}
        <AiOutlineLogout
          className="text-[24px] cursor-pointer hover:text-primary"
          onClick={logout}
        />
      </NavbarContent>
      <NavbarMenu className="mt-3">
        {menuItems.map((item: any, index: number) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full mt-3 hover:text-primary"
              color="foreground"
              // color={
              //   index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              // }
              href={item.path}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
