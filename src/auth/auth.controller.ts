import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Wallet } from 'ethers';
import { UserRequest } from '~/types/request';
import { formatResponse, ResponseData } from '~/types/response-data';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { CreateNonceDto } from './dto/create-nonce.dto';
import { SignMessageDto } from './dto/sign-message.dto';
import { SigninWalletDto } from './dto/signin-wallet.dto';
import { Web3AuthGuard } from './guard/web3-auth.guard';
import {
  NonceGenerationResponse,
  SignedInResponse,
  WalletGenerationResponse,
  WalletSignResponse,
} from './types/responses';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: SigninWalletDto })
  @UseGuards(Web3AuthGuard)
  @Post('/signin/wallet')
  async signInUsingWallet(
    @Request() req: UserRequest,
  ): Promise<ResponseData<SignedInResponse>> {
    const result = await this.authService.signIn('wallet', req.user);
    return formatResponse(result);
  }

  @Public()
  @Post('/signin/wallet/sign')
  async signMessageUsingPrivateKey(
    @Body() signMessageDto: SignMessageDto,
  ): Promise<ResponseData<WalletSignResponse>> {
    const wallet = new Wallet(signMessageDto.privateKey);
    const signature = await wallet.signMessage(signMessageDto.message);
    return formatResponse({ signature });
  }

  @Public()
  @Post('/signin/wallet/generate')
  async generateWallet(): Promise<ResponseData<WalletGenerationResponse>> {
    const wallet = Wallet.createRandom();
    return formatResponse({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  @Public()
  @Post('/signin/wallet/nonce')
  async createNonceToSignInUsingWallet(
    @Body() createNonceDto: CreateNonceDto,
  ): Promise<ResponseData<NonceGenerationResponse>> {
    const { message } = await this.authService.signInNonce(createNonceDto);
    return formatResponse({ message });
  }
}
