import 'package:college_project/features/auth/change_password/cubit/change_password_cubit.dart';
import 'package:college_project/features/auth/change_password/cubit/change_password_state.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChangePasswordScreen extends StatelessWidget {
  const ChangePasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ChangePasswordCubit(),
      child: const _ChangePasswordScreenView(),
    );
  }
}

class _ChangePasswordScreenView extends StatefulWidget {
  const _ChangePasswordScreenView();

  @override
  State<_ChangePasswordScreenView> createState() =>
      _ChangePasswordScreenViewState();
}

class _ChangePasswordScreenViewState extends State<_ChangePasswordScreenView> {
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ChangePasswordCubit, ChangePasswordState>(
      listener: (context, state) {
        if (state is ChangePasswordSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('passwordChangedSuccessfully')),
          );
          Navigator.pop(context);
        } else if (state is ChangePasswordFailure) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.error)));
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(title: Text(S.of(context).changePassword)),
          body: Center(
            child: Column(
              children: [
                TextFormField(controller: passwordController),
                TextFormField(controller: confirmPasswordController),
                ElevatedButton(
                  onPressed: () {
                    context.read<ChangePasswordCubit>().changePassword(
                      newPassword: passwordController.text,
                    );
                  },
                  child: const Text('Change Password'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
