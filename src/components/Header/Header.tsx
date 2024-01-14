"use client";

import { UserContext } from "@/context/userContext";
import {
  getAccountDetails,
  getRequestToken,
  getUserSessionId,
} from "@/libs/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { MdLocalMovies } from "react-icons/md";
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import SearchBar from "../Search/SearchBar";

const Header = () => {
  const router = useRouter();
  const [requestToken, setRequestToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    user: { username, accountId, sessionId },
    setUser,
  } = useContext(UserContext);

  const handleConnexion = async () => {
    const responseToken = await getRequestToken();
    router.push(
      `${process.env.NEXT_PUBLIC_TMDB_AUTHENTICATE}${responseToken.request_token}?redirect_to=${process.env.NEXT_PUBLIC_URL}`
    );
  };

  useEffect(() => {
    setRequestToken(localStorage.getItem("request_token"));

    async function getUserAccount() {
      if (!requestToken) return;
      const responseJsonSession = await getUserSessionId(requestToken);

      await getAccountDetails(responseJsonSession.session_id);
      window.location.reload();
    }
    if (requestToken && !username && !accountId && !sessionId) {
      getUserAccount();
    }
  }, [accountId, requestToken, router, sessionId, setUser, username]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: "bg-primary bg-opacity-90 justify-between",
        wrapper: "max-w-[80%] mx-auto",
        item: "sm:text-xl",
      }}
    >
      {isSearchOpen ? (
        <NavbarContent>
          <SearchBar
            styleBase="w-full"
            styleContainer=""
            setIsSearchOpen={setIsSearchOpen}
            isHeader={true}
          />
          <button type="button" onClick={() => setIsSearchOpen(false)}>
            <RxCross1 size={18} className="text-xl font-bold" />
          </button>
        </NavbarContent>
      ) : (
        <>
          <NavbarContent>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden"
            />
            <NavbarBrand>
              <Link
                href="/"
                className="hover:-translate-y-2 duration-500 transition-all sm:text-xl flex flex-row items-center"
              >
                <TiHome />
                <span className="ml-2">Accueil</span>
              </Link>
            </NavbarBrand>
          </NavbarContent>
          <NavbarContent className="flex gap-4 md:gap-10" justify="end">
            <NavbarItem className="hidden md:block hover:-translate-y-2 duration-500 transition-all">
              <Link href="/movies" className="flex flex-row items-center">
                <MdLocalMovies />
                <span className="ml-2">Films</span>
              </Link>
            </NavbarItem>
            <NavbarItem className="hidden md:block hover:-translate-y-2 duration-500 transition-all">
              <Link href="/tvshows" className="flex flex-row items-center">
                <PiTelevisionSimpleFill />
                <span className="ml-2">Séries TV</span>
              </Link>
            </NavbarItem>
            {!username && !accountId && !sessionId ? (
              <NavbarItem className="hidden md:block hover:-translate-y-2 duration-500 transition-all cursor-pointer">
                <div onClick={handleConnexion}>Connexion/Inscription</div>
              </NavbarItem>
            ) : (
              <NavbarItem className="hidden md:block hover:-translate-y-2 duration-500 transition-all">
                <Link href="/profil" className="flex flex-row items-center">
                  <IoPersonSharp />
                  <span className="ml-2">Profil</span>
                </Link>
              </NavbarItem>
            )}
            <NavbarItem
              className="cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch size={18} />
            </NavbarItem>
          </NavbarContent>
        </>
      )}

      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/movies" className="flex flex-row items-center">
            <MdLocalMovies />
            <span className="ml-2">Films</span>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/tvshows" className="flex flex-row items-center">
            <PiTelevisionSimpleFill />
            <span className="ml-2">Séries TV</span>
          </Link>
        </NavbarMenuItem>
        {!username && !accountId && !sessionId ? (
          <NavbarMenuItem className="hover:-translate-y-2 duration-500 transition-all cursor-pointer">
            <div onClick={handleConnexion}>Connexion/Inscription</div>
          </NavbarMenuItem>
        ) : (
          <NavbarMenuItem>
            <Link href="/profil" className="flex flex-row items-center">
              <IoPersonSharp />
              <span className="ml-2">Profil</span>
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
